import csv
import json
import math
import os
import shutil
import statistics
import subprocess
import sys
from pathlib import Path

from PIL import Image

bench = Path(sys.argv[1])
app = Path(sys.argv[2])
texbin = Path(os.environ.get("TEXBIN") or Path(shutil.which("pdftoppm") or "pdftoppm").parent)
results = Path(bench, "results")
data = json.loads(Path(results, "results.json").read_text(encoding="utf-8"))
programs, documents = data["programs"], data["documents"]
labels = {"mlatex": "mLaTeX", "pdflatex": "pdfLaTeX", "xelatex": "XeLaTeX", "lualatex": "LuaLaTeX", "typst": "Typst"}

public = Path(app, "public", "benchmark")
shutil.rmtree(public, ignore_errors=True)
for name in ("pages", "pdfs", "corpus"):
    Path(public, name).mkdir(parents=True)


def summary(values):
    deciles = statistics.quantiles(values, n=10, method="inclusive")
    return {
        "median": statistics.median(values), "mean": statistics.fmean(values),
        "min": min(values), "max": max(values), "p10": deciles[0], "p90": deciles[8],
        "stdev": statistics.stdev(values) if len(values) > 1 else 0.0,
    }


finals = {(final["program"], final["document"]): final for final in data["finals"]}
rows = []
for document in documents:
    for program in programs:
        samples = [sample for sample in data["samples"] if sample["program"] == program and sample["document"] == document]
        final = finals[(program, document)]
        rows.append({
            "program": program, "document": document, "runs": len(samples),
            "ok": all(sample["ok"] for sample in samples),
            "wall": summary([sample["wall"] for sample in samples]),
            "first": summary([sample["first"] for sample in samples]),
            "cpu": summary([sample["cpu"] for sample in samples]),
            "peak": max(sample["peak"] for sample in samples),
            "peakMedian": statistics.median(sample["peak"] for sample in samples),
            "steps": [step["name"] for step in final["steps"]],
            "pages": final.get("pages", 0), "bytes": final.get("bytes", 0),
            "raw": [round(sample["wall"], 5) for sample in samples],
        })
table = {(row["program"], row["document"]): row for row in rows}

speedups = {}
for other in programs[1:]:
    ratios = [table[(other, document)]["wall"]["median"] / table[("mlatex", document)]["wall"]["median"] for document in documents]
    firsts = [table[(other, document)]["first"]["median"] / table[("mlatex", document)]["first"]["median"] for document in documents]
    speedups[other] = {
        "geomean": math.exp(statistics.fmean(math.log(ratio) for ratio in ratios)),
        "firstGeomean": math.exp(statistics.fmean(math.log(ratio) for ratio in firsts)),
        "min": min(ratios), "max": max(ratios),
    }

images = {}
scratch = Path(bench, "render")
shutil.rmtree(scratch, ignore_errors=True)
scratch.mkdir()
for document in documents:
    last = min(6, max(finals[(program, document)].get("pages", 0) for program in programs))
    for program in programs:
        pdf = Path(results, "pdfs", f"{document}-{program}.pdf")
        shutil.copy(pdf, Path(public, "pdfs", pdf.name))
        subprocess.run([str(Path(texbin, "pdftoppm.exe")), "-png", "-r", "100", "-f", "1", "-l", str(last), str(pdf),
                        str(Path(scratch, f"{document}-{program}"))], check=True)
        renders = sorted(scratch.glob(f"{document}-{program}-*.png"), key=lambda render: int(render.stem.rsplit("-", 1)[1]))
        paths = []
        for number, render in enumerate(renders, 1):
            name = f"{document}-{program}-{number}.webp"
            Image.open(render).save(Path(public, "pages", name), "WEBP", lossless=True, method=6)
            paths.append(f"/benchmark/pages/{name}")
        images[f"{document}-{program}"] = paths
shutil.rmtree(scratch)

sources = {}
for source in sorted(Path(bench, "corpus").iterdir()):
    shutil.copy(source, Path(public, "corpus", source.name))
    text = source.read_text(encoding="utf-8")
    sources[source.name] = {"lines": text.count("\n"), "bytes": len(text.encode("utf-8"))}
for script in ("corpus.py", "harness.py", "export.py"):
    shutil.copy(Path(bench, script), Path(public, script))
shutil.copy(Path(results, "results.json"), Path(public, "results.json"))

with open(Path(public, "results.csv"), "w", newline="", encoding="utf-8") as file:
    sheet = csv.writer(file)
    sheet.writerow(["Document", "Program", "Median (ms)", "Fastest (ms)", "90th percentile (ms)", "Spread (ms)",
                    "First pass (ms)", "CPU (ms)", "Memory (MB)", "Pages", "PDF (KB)", "Steps", "Relative to mLaTeX"])
    for row in rows:
        baseline = table[("mlatex", row["document"])]["wall"]["median"]
        sheet.writerow([row["document"].capitalize(), labels[row["program"]], f"{row['wall']['median'] * 1000:.2f}",
                        f"{row['wall']['min'] * 1000:.2f}", f"{row['wall']['p90'] * 1000:.2f}",
                        f"{row['wall']['stdev'] * 1000:.2f}", f"{row['first']['median'] * 1000:.2f}",
                        f"{row['cpu']['median'] * 1000:.2f}", f"{row['peakMedian'] / 1048576:.1f}", row["pages"],
                        f"{row['bytes'] / 1024:.0f}", " + ".join(row["steps"]), f"{row['wall']['median'] / baseline:.2f}"])
with open(Path(public, "builds.csv"), "w", newline="", encoding="utf-8") as file:
    sheet = csv.writer(file)
    sheet.writerow(["Round", "Document", "Program", "Wall (ms)", "First pass (ms)", "CPU (ms)", "Memory (MB)", "Steps"])
    for sample in data["samples"]:
        sheet.writerow([sample["round"] + 1, sample["document"].capitalize(), labels[sample["program"]],
                        f"{sample['wall'] * 1000:.2f}", f"{sample['first'] * 1000:.2f}", f"{sample['cpu'] * 1000:.2f}",
                        f"{sample['peak'] / 1048576:.1f}", " + ".join(step["name"] for step in sample["steps"])])

payload = {
    "started": data["started"], "finished": data["finished"], "machine": data["machine"],
    "versions": {program: text.removeprefix("This is ") for program, text in data["versions"].items()},
    "rounds": data["rounds"], "warmups": data["warmups"], "sandbox": data["sandbox"],
    "programs": programs, "documents": documents,
    "rows": rows, "speedups": speedups, "images": images, "sources": sources,
    "samples": len(data["samples"]),
}
Path(app, "lib", "benchmark.json").write_text(json.dumps(payload, indent=1), encoding="utf-8")

size = sum(path.stat().st_size for path in public.rglob("*") if path.is_file())
print(f"Exported {size / 1e6:.1f} MB to {public}")
for other, speedup in speedups.items():
    print(f"mLaTeX against {labels[other]}: {speedup['geomean']:.1f}x faster, {speedup['min']:.1f}x to {speedup['max']:.1f}x")
