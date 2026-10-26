import ctypes
import datetime
import json
import os
import platform
import random
import re
import shutil
import subprocess
import sys
import time
from ctypes import wintypes
from pathlib import Path

import psutil

corpus = Path(sys.argv[1]).resolve()
results = Path(sys.argv[2]).resolve()
rounds = int(sys.argv[3]) if len(sys.argv) > 3 else 20
warmups = 2

texbin = Path(os.environ.get("TEXBIN") or Path(shutil.which("pdflatex") or "pdflatex").parent)
mlatex = Path(os.environ.get("MLATEX") or shutil.which("mlatex") or "mlatex")
typst = Path(os.environ.get("TYPST") or shutil.which("typst") or "typst").resolve()
documents = ["startup", "structure", "expressions", "tabular", "graphics", "citations", "monograph"]
programs = ["mlatex", "pdflatex", "xelatex", "lualatex", "typst"]

# One hardware thread on each of the eight physical cores: on Zen, logical CPUs 2k and 2k+1 share core k.
affinity = 0x5555
ceiling = 4 << 30

kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
ntdll = ctypes.WinDLL("ntdll")


class Basic(ctypes.Structure):
    _fields_ = [("process", ctypes.c_int64), ("job", ctypes.c_int64), ("flags", wintypes.DWORD),
                ("minimum", ctypes.c_size_t), ("maximum", ctypes.c_size_t), ("active", wintypes.DWORD),
                ("affinity", ctypes.c_size_t), ("priority", wintypes.DWORD), ("scheduling", wintypes.DWORD)]


class Extended(ctypes.Structure):
    _fields_ = [("basic", Basic), ("counters", ctypes.c_uint64 * 6), ("process", ctypes.c_size_t),
                ("limit", ctypes.c_size_t), ("largest", ctypes.c_size_t), ("peak", ctypes.c_size_t)]


class Accounting(ctypes.Structure):
    _fields_ = [("user", ctypes.c_int64), ("kernel", ctypes.c_int64), ("period", ctypes.c_int64 * 2),
                ("faults", wintypes.DWORD), ("processes", wintypes.DWORD), ("active", wintypes.DWORD),
                ("terminated", wintypes.DWORD)]


kernel32.CreateJobObjectW.restype = wintypes.HANDLE
kernel32.CreateJobObjectW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR]
kernel32.SetInformationJobObject.argtypes = [wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD]
kernel32.QueryInformationJobObject.argtypes = [wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD, ctypes.c_void_p]
kernel32.AssignProcessToJobObject.argtypes = [wintypes.HANDLE, wintypes.HANDLE]
kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
ntdll.NtResumeProcess.argtypes = [wintypes.HANDLE]


def execute(command, folder, environment):
    job = kernel32.CreateJobObjectW(None, None)
    limits = Extended()
    # Pinned to the cores above, capped in memory, and killed with the job.
    limits.basic.flags = 0x10 | 0x200 | 0x2000
    limits.basic.affinity = affinity
    limits.limit = ceiling
    if not kernel32.SetInformationJobObject(job, 9, ctypes.byref(limits), ctypes.sizeof(limits)):
        raise ctypes.WinError(ctypes.get_last_error())
    start = time.perf_counter_ns()
    # Suspended until it is in the job, with no window, at high priority.
    process = subprocess.Popen(command, cwd=folder, env=environment, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL, creationflags=0x4 | 0x08000000 | 0x80)
    if not kernel32.AssignProcessToJobObject(job, int(process._handle)):
        raise ctypes.WinError(ctypes.get_last_error())
    ntdll.NtResumeProcess(int(process._handle))
    try:
        code = process.wait(timeout=600)
    except subprocess.TimeoutExpired:
        process.kill()
        code = -1
    wall = (time.perf_counter_ns() - start) / 1e9
    accounting = Accounting()
    kernel32.QueryInformationJobObject(job, 1, ctypes.byref(accounting), ctypes.sizeof(accounting), None)
    kernel32.QueryInformationJobObject(job, 9, ctypes.byref(limits), ctypes.sizeof(limits), None)
    kernel32.CloseHandle(job)
    return {"wall": wall, "cpu": (accounting.user + accounting.kernel) / 1e7, "peak": limits.peak,
            "code": code, "processes": accounting.processes}


home = Path(results, "home")
for name in ("texmf", "texmf-var", "texmf-config"):
    Path(home, name).mkdir(parents=True, exist_ok=True)
system = os.environ.get("SystemRoot", r"C:\Windows")
base = {
    "SystemRoot": system, "SystemDrive": os.environ.get("SystemDrive", "C:"), "windir": system,
    "PATH": f"{texbin};{Path(system, 'System32')}",
    "USERPROFILE": str(home), "HOME": str(home),
    "TEXMFHOME": str(Path(home, "texmf")), "TEXMFVAR": str(Path(home, "texmf-var")),
    "TEXMFCONFIG": str(Path(home, "texmf-config")),
    "openout_any": "p", "shell_escape": "f",
    "SOURCE_DATE_EPOCH": "1792022400", "FORCE_SOURCE_DATE": "1",
}
rerun = re.compile(r"Rerun to get|Label\(s\) may have changed|Rerun LaTeX|There were undefined (references|citations)")


def measure(program, document, keep=False):
    folder = Path(results, "runs", f"{program}-{document}")
    shutil.rmtree(folder, ignore_errors=True)
    scratch = Path(folder, "tmp")
    scratch.mkdir(parents=True)
    shutil.copy(Path(corpus, f"{document}.{'typ' if program == 'typst' else 'tex'}"), folder)
    shutil.copy(Path(corpus, "references.bib"), folder)
    environment = {**base, "TEMP": str(scratch), "TMP": str(scratch)}

    steps = []
    if program == "mlatex":
        steps.append({"name": "mlatex", **execute([str(mlatex), "-q", "--offline", f"{document}.tex"], folder, environment)})
    elif program == "typst":
        command = [str(typst), "compile", "--ignore-system-fonts", f"{document}.typ", f"{document}.pdf"]
        steps.append({"name": "typst", **execute(command, folder, environment)})
    else:
        command = [str(Path(texbin, f"{program}.exe")), "-interaction=batchmode", "-halt-on-error", "-no-shell-escape", f"{document}.tex"]
        steps.append({"name": f"{program} 1", **execute(command, folder, environment)})
        aux = Path(folder, f"{document}.aux")
        if aux.exists() and "\\bibdata" in aux.read_text(errors="replace"):
            steps.append({"name": "bibtex", **execute([str(Path(texbin, "bibtex.exe")), "-terse", document], folder, environment)})
            steps.append({"name": f"{program} 2", **execute(command, folder, environment)})
        for _ in range(4):
            if not rerun.search(Path(folder, f"{document}.log").read_text(errors="replace")):
                break
            passes = sum(1 for step in steps if step["name"].startswith(program))
            steps.append({"name": f"{program} {passes + 1}", **execute(command, folder, environment)})

    pdf = Path(folder, f"{document}.pdf")
    record = {
        "program": program, "document": document,
        "wall": sum(step["wall"] for step in steps), "cpu": sum(step["cpu"] for step in steps),
        "peak": max(step["peak"] for step in steps), "ok": all(step["code"] == 0 for step in steps) and pdf.exists(),
        "first": steps[0]["wall"], "passes": len(steps), "steps": steps,
    }
    if keep:
        info = subprocess.run([str(Path(texbin, "pdfinfo.exe")), str(pdf)], capture_output=True, text=True).stdout
        match = re.search(r"Pages:\s+(\d+)", info)
        record["pages"] = int(match.group(1)) if match else 0
        record["bytes"] = pdf.stat().st_size if pdf.exists() else 0
        if pdf.exists():
            Path(results, "pdfs").mkdir(exist_ok=True)
            shutil.copy(pdf, Path(results, "pdfs", f"{document}-{program}.pdf"))
    return record


results.mkdir(parents=True, exist_ok=True)
idle = psutil.cpu_percent(interval=3)
machine = {
    "cpu": subprocess.run(["powershell", "-NoProfile", "-c", "(Get-CimInstance Win32_Processor).Name"],
                          capture_output=True, text=True).stdout.strip(),
    "cores": psutil.cpu_count(False), "threads": psutil.cpu_count(True),
    "memory": psutil.virtual_memory().total, "os": platform.platform(),
    "python": platform.python_version(), "idleBefore": idle,
}
binaries = {"mlatex": mlatex, "pdflatex": Path(texbin, "pdflatex.exe"), "xelatex": Path(texbin, "xelatex.exe"),
            "lualatex": Path(texbin, "lualatex.exe"), "typst": typst}
versions = {}
for program, binary in binaries.items():
    try:
        versions[program] = subprocess.run([str(binary), "--version"], capture_output=True, text=True, timeout=30).stdout.splitlines()[0].strip()
    except Exception:
        versions[program] = "unknown"
print(json.dumps(machine), json.dumps(versions), sep="\n", flush=True)

started = datetime.datetime.now().astimezone()
finals = {}
for document in documents:
    for program in programs:
        for _ in range(warmups):
            measure(program, document)
        finals[(program, document)] = measure(program, document, keep=True)
        print(f"Warmed {program} on {document}: {finals[(program, document)]['wall']:.3f}s", flush=True)

samples = []
chance = random.Random(20261015)
for lap in range(rounds):
    for document in documents:
        order = programs[:]
        chance.shuffle(order)
        for program in order:
            record = measure(program, document)
            record["round"] = lap
            samples.append(record)
    print(f"Round {lap + 1} of {rounds} done", flush=True)

machine["idleAfter"] = psutil.cpu_percent(interval=3)
report = {
    "started": started.isoformat(), "finished": datetime.datetime.now().astimezone().isoformat(),
    "machine": machine, "versions": versions, "rounds": rounds, "warmups": warmups,
    "sandbox": {
        "affinity": hex(affinity), "priority": "high for each program process (a job-wide priority needs admin rights)",
        "memoryCap": ceiling, "environment": sorted([*base, "TEMP", "TMP"]),
        "network": "mlatex --offline; TeX with shell escape off; Typst with no packages to fetch",
        "writes": "openout_any=p: TeX writes only inside its run folder",
    },
    "documents": documents, "programs": programs,
    "finals": [finals[(program, document)] for document in documents for program in programs],
    "samples": samples,
}
Path(results, "results.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
shutil.rmtree(Path(results, "runs"), ignore_errors=True)
print(f"Written {Path(results, 'results.json')}")
