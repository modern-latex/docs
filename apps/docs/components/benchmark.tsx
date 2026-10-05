"use client";

import type { PointerEvent, ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Button } from "@mlatex/ui/src/components/button";
import { Chart } from "@mlatex/ui/src/components/chart";
import { Select } from "@mlatex/ui/src/components/select";
import { cn } from "@mlatex/ui/src/lib/utils";
import {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
} from "fumadocs-ui/components/codeblock";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Download, Minus, Plus } from "lucide-react";

import data from "@/lib/benchmark.json";

type Program = "mlatex" | "pdflatex" | "xelatex" | "lualatex" | "typst";
type Row = (typeof data.rows)[number];
type Metric = "wall" | "first" | "cpu" | "peak";

const programs = data.programs as Program[];
const documents = data.documents;
const others = programs.filter((program) => program !== "mlatex");

const names: Record<Program, string> = {
	mlatex: "mLaTeX",
	pdflatex: "pdfLaTeX",
	xelatex: "XeLaTeX",
	lualatex: "LuaLaTeX",
	typst: "Typst",
};

// pdfLaTeX and XeLaTeX are shades of the site's own zinc, mLaTeX the ink;
// LuaLaTeX takes Lua's blue, and Typst, with a language of its own, its teal.
const swatches: Record<Program, string> = {
	mlatex: "bg-zinc-900 dark:bg-zinc-50",
	pdflatex: "bg-zinc-400 dark:bg-zinc-500",
	xelatex: "bg-zinc-300 dark:bg-zinc-700",
	lualatex: "bg-blue-600 dark:bg-blue-500",
	typst: "bg-teal-600 dark:bg-teal-700",
};

// The same colours as variables, for the chart's bars.
const paints = [
	"[--program-mlatex:oklch(0.21_0.006_285.885)] dark:[--program-mlatex:oklch(0.985_0_0)]",
	"[--program-pdflatex:oklch(0.705_0.015_286.067)] dark:[--program-pdflatex:oklch(0.552_0.016_285.938)]",
	"[--program-xelatex:oklch(0.871_0.006_286.286)] dark:[--program-xelatex:oklch(0.37_0.013_285.805)]",
	"[--program-lualatex:oklch(0.546_0.245_262.881)] dark:[--program-lualatex:oklch(0.623_0.214_259.815)]",
	"[--program-typst:oklch(0.6_0.118_184.704)] dark:[--program-typst:oklch(0.511_0.096_186.391)]",
];

export const titles: Record<string, string> = {
	startup: "Startup",
	structure: "Structure",
	expressions: "Expressions",
	tabular: "Tabular",
	graphics: "Graphics",
	citations: "Citations",
	monograph: "Monograph",
};

function row(program: Program, document: string): Row {
	return data.rows.find(
		(r) => r.program === program && r.document === document,
	)!;
}

function time(seconds: number) {
	if (seconds < 1) {
		return `${(seconds * 1000).toFixed(seconds < 0.1 ? 1 : 0)} ms`;
	}
	return `${seconds.toFixed(2)} s`;
}

function megabytes(bytes: number) {
	return `${(bytes / 1048576).toFixed(bytes < 104857600 ? 1 : 0)} MB`;
}

function times(ratio: number) {
	return `${ratio >= 10 ? ratio.toFixed(0) : ratio.toFixed(1)}×`;
}

function list(values: string[]) {
	return values.length > 1
		? `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`
		: values[0];
}

/** The card every block on the page sits in, as the docs' code blocks do. */
function Card({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"not-prose my-6 overflow-hidden rounded-sm border bg-fd-card shadow-sm",
				className,
			)}
		>
			{children}
		</div>
	);
}

/** Underlined text tabs, drawn as the docs' own tabs are. */
function Switch<T extends string>({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: T;
	options: { value: T; label: string }[];
	onChange: (value: T) => void;
}) {
	return (
		<div
			role="group"
			aria-label={label}
			className="flex flex-row overflow-x-auto text-fd-muted-foreground"
		>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={option.value === value}
					onClick={() => onChange(option.value)}
					className="group relative inline-flex items-center px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-fd-accent-foreground aria-pressed:text-fd-primary"
				>
					<span className="absolute inset-x-2 bottom-0 h-px group-aria-pressed:bg-fd-primary" />
					{option.label}
				</button>
			))}
		</div>
	);
}

function Swatch({ program }: { program: Program }) {
	return (
		<span
			aria-hidden
			className={cn("inline-block size-2.5 shrink-0", swatches[program])}
		/>
	);
}

/** The headline figures: speed against each program, the book, memory, and how much was measured. */
export function Speedups() {
	const speedups = data.speedups as Record<
		string,
		{ geomean: number; min: number; max: number }
	>;
	const book = (program: Program) => row(program, "monograph").wall.median;
	const peak = (program: Program) =>
		Math.max(
			...data.rows.filter((r) => r.program === program).map((r) => r.peak),
		);
	const tiles = [
		...others.map((program) => {
			const { geomean, min, max } = speedups[program];
			return {
				label: `Against ${names[program]}`,
				value:
					geomean >= 1
						? `${times(geomean)} faster`
						: `${times(1 / geomean)} slower`,
				note: `Full build, geometric mean over seven documents; ${times(min)} to ${times(max)} by document.`,
			};
		}),
		{
			label: "The 110-page monograph",
			value: time(book("mlatex")),
			note: `${list(others.map((program) => `${names[program]} ${time(book(program))}`))}.`,
		},
		{
			label: "Peak memory",
			value: megabytes(peak("mlatex")),
			note: `mLaTeX's worst build. ${list(others.map((program) => `${names[program]} ${megabytes(peak(program))}`))}.`,
		},
	];
	return (
		<div className="@container not-prose my-6">
			<div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border bg-fd-border shadow-sm @md:grid-cols-2 @xl:grid-cols-3">
				{tiles.map((tile) => (
					<div key={tile.label} className="flex flex-col gap-1 bg-fd-card p-4">
						<span className="text-sm text-fd-muted-foreground">
							{tile.label}
						</span>
						<span className="text-2xl font-semibold tracking-tight tabular-nums">
							{tile.value}
						</span>
						<p className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">
							{tile.note}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

const metrics: { value: Metric; label: string; note: string }[] = [
	{
		value: "wall",
		label: "Full build",
		note: "Median wall-clock time to a finished PDF: for LaTeX every pass until references settle, and BibTeX when the document cites.",
	},
	{
		value: "first",
		label: "First pass",
		note: "The first run alone. For mLaTeX and Typst that is the whole build; after one LaTeX pass, references can still be unresolved.",
	},
	{
		value: "cpu",
		label: "CPU time",
		note: "User and kernel time over every process the build started. mLaTeX and Typst use more than one thread, so their CPU time can pass their wall time.",
	},
	{
		value: "peak",
		label: "Memory",
		note: "Median peak memory of the whole build, every process included.",
	},
];

/** Each document's time or memory per program; programs can be hidden to compare the rest. */
export function Timings() {
	const [metric, setMetric] = useState<Metric>("wall");
	const [hidden, setHidden] = useState<Program[]>([]);
	const [focus, setFocus] = useState<number | null>(null);
	const shown = programs.filter((program) => !hidden.includes(program));

	// Milliseconds for times and megabytes for memory, so bars and the legend read in those units.
	const measure = (r: Row) =>
		metric === "peak" ? r.peakMedian / 1048576 : r[metric].median * 1000;
	const format = (value: number) =>
		metric === "peak" ? `${value.toFixed(1)} MB` : time(value / 1000);
	const points = documents.map((document) => ({
		document: titles[document],
		...Object.fromEntries(
			shown.map((program) => [program, measure(row(program, document))]),
		),
	}));
	const toggle = (program: Program) =>
		setHidden((current) =>
			current.includes(program)
				? current.filter((other) => other !== program)
				: shown.length > 1
					? [...current, program]
					: current,
		);

	return (
		<Card>
			<div className="border-b px-2">
				<Switch
					label="Measure"
					value={metric}
					options={metrics}
					onChange={setMetric}
				/>
			</div>
			<div className={cn(paints, "px-4 pt-4")}>
				<Chart
					key={`${metric}-${shown.join("-")}`}
					rows={points}
					index="document"
					series={shown.map((program) => ({
						key: program,
						label: names[program],
						color: `var(--program-${program})`,
					}))}
					onHover={setFocus}
					label={`${metrics.find((m) => m.value === metric)?.label} for each document and program`}
				/>
			</div>
			<div className="flex flex-col gap-2 border-t px-4 py-3">
				<div
					role="group"
					aria-label="Programs"
					className="flex flex-wrap items-center gap-1"
				>
					<span className="w-28 shrink-0 truncate text-sm font-medium">
						{focus === null ? "Every document" : points[focus].document}
					</span>
					{programs.map((program) => (
						<button
							key={program}
							type="button"
							aria-pressed={!hidden.includes(program)}
							onClick={() => toggle(program)}
							className="inline-flex items-center gap-2 rounded-sm px-2 py-1 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground aria-pressed:text-fd-foreground"
						>
							<span
								className={cn(
									"inline-flex",
									hidden.includes(program) && "opacity-30",
								)}
							>
								<Swatch program={program} />
							</span>
							{names[program]}
							{focus !== null && !hidden.includes(program) && (
								<span className="text-fd-muted-foreground tabular-nums">
									{format(measure(row(program, documents[focus])))}
								</span>
							)}
						</button>
					))}
				</div>
				<p className="text-xs leading-relaxed text-fd-muted-foreground">
					{metrics.find((m) => m.value === metric)!.note} Hover a document to
					read its numbers here; click an program to hide or show it.
				</p>
			</div>
		</Card>
	);
}

/** Every number behind the chart as files: per document and program, per build, and the raw record. */
export function Downloads() {
	const files = [
		{
			name: "results.csv",
			detail: `${data.rows.length} rows: each document and program's median, fastest and 90th-percentile build, first pass, CPU time, memory, pages, PDF size and steps.`,
		},
		{
			name: "builds.csv",
			detail: `${data.samples.toLocaleString()} rows: every measured build's round, wall time, first pass, CPU time, memory and steps.`,
		},
		{
			name: "results.json",
			detail:
				"The raw record, with the machine, the programs' versions and the sandbox's settings.",
		},
	];
	return (
		<Card>
			{files.map((file) => (
				<div
					key={file.name}
					className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-3 last:border-b-0"
				>
					<div className="min-w-0 flex-1">
						<p className="font-mono text-sm">{file.name}</p>
						<p className="mt-0.5 text-xs leading-relaxed text-fd-muted-foreground">
							{file.detail}
						</p>
					</div>
					<a
						href={`/benchmark/${file.name}`}
						download
						className="inline-flex shrink-0 items-center gap-2 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
					>
						<Download className="size-3.5" />
						Download
					</a>
				</div>
			))}
		</Card>
	);
}

type Mode = "slider" | "side" | "difference";

/**
 * The PDFs each program made from one file, page against page. The wipe eases
 * after the pointer as GSAP's demos move, and springs back to the middle when
 * the pointer leaves. The viewer keeps its size: − and + zoom the pages
 * inside it, which scroll once they are larger than it, about the middle of
 * what was in view, and the percentage between them sets them back.
 */
export function Comparison() {
	const [document, setDocument] = useState("structure");
	const [mode, setMode] = useState<Mode>("slider");
	const [first, setFirst] = useState<Program>("mlatex");
	const [second, setSecond] = useState<Program>("pdflatex");
	const [page, setPage] = useState(0);
	const [scale, setScale] = useState(1);
	// The sizes the pages can be looked at, as a share of the size that fits.
	const scales = [0.5, 0.75, 1, 1.25, 1.5, 2];
	const step = scales.indexOf(scale);
	// A page's height over its width: US Letter, as every program set it.
	const ratio = 792 / 612;

	// The viewer's inside, measured, so that the pages fit it at 100%.
	const viewer = useRef<HTMLDivElement>(null);
	const [box, setBox] = useState({ width: 0, height: 0 });
	useEffect(() => {
		const node = viewer.current;
		if (!node) return;
		const observer = new ResizeObserver(([entry]) =>
			setBox({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			}),
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	// Side by side, three pages across and two down when there is room, each
	// with its name over it; otherwise two across, fitted to the width.
	const columns = box.width >= 520 ? 3 : 2;
	const rows = Math.ceil(programs.length / columns);
	const gap = 16;
	const caption = 28;
	const across = (box.width - gap * (columns - 1)) / columns;
	const fit =
		mode === "side"
			? columns === 3
				? Math.min(
						across,
						((box.height - gap * (rows - 1)) / rows - caption) / ratio,
					)
				: across
			: Math.min(box.width, box.height / ratio);
	const width = Math.max(0, Math.floor(fit * scale));

	// A zoom keeps the middle of what was in view in the middle.
	const anchor = useRef<{ x: number; y: number }>(undefined);
	const zoom = (next: number) => {
		const node = viewer.current;
		if (node) {
			anchor.current = {
				x: (node.scrollLeft + node.clientWidth / 2) / node.scrollWidth,
				y: (node.scrollTop + node.clientHeight / 2) / node.scrollHeight,
			};
		}
		setScale(next);
	};
	useLayoutEffect(() => {
		const node = viewer.current;
		const point = anchor.current;
		if (!node || !point) return;
		node.scrollLeft = point.x * node.scrollWidth - node.clientWidth / 2;
		node.scrollTop = point.y * node.scrollHeight - node.clientHeight / 2;
		anchor.current = undefined;
	}, [scale]);

	// The wipe lives outside React: GSAP tweens it and writes it to --cut on the stage.
	const stage = useRef<HTMLDivElement>(null);
	const wipe = useRef({ cut: 50 });
	const slide = (cut: number, ease = "power3.out", duration = 0.5) =>
		gsap.to(wipe.current, {
			cut: Math.min(100, Math.max(0, cut)),
			duration,
			ease,
			overwrite: true,
			onUpdate: () => {
				stage.current?.style.setProperty("--cut", `${wipe.current.cut}%`);
				stage.current?.setAttribute(
					"aria-valuenow",
					String(Math.round(wipe.current.cut)),
				);
			},
		});
	const follow = (event: PointerEvent<HTMLDivElement>) => {
		const box = event.currentTarget.getBoundingClientRect();
		slide(((event.clientX - box.left) / box.width) * 100);
	};

	const images = data.images as Record<string, string[]>;
	const count = Math.max(
		...programs.map((e) => images[`${document}-${e}`].length),
	);
	const shown = Math.min(page, count - 1);
	const source = (program: Program) => images[`${document}-${program}`][shown];

	const picker = (
		value: Program,
		change: (e: Program) => void,
		label: string,
	) => (
		<Select value={value} onValueChange={(v) => change(v as Program)}>
			<Select.Trigger className="h-8 w-32 rounded-sm" aria-label={label}>
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				{programs.map((program) => (
					<Select.Item key={program} value={program}>
						{names[program]}
					</Select.Item>
				))}
			</Select.Content>
		</Select>
	);

	const sheet = (program: Program) =>
		source(program) ? (
			<img
				src={source(program)}
				alt={`Page ${shown + 1} of ${titles[document]}, set by ${names[program]}`}
				className="block h-full w-full bg-white object-contain"
				draggable={false}
			/>
		) : (
			<div className="grid h-full w-full place-items-center bg-white text-sm text-zinc-500">
				No page {shown + 1}
			</div>
		);

	return (
		<Card>
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-2">
				<Switch
					label="View"
					value={mode}
					options={[
						{ value: "slider", label: "Slider" },
						{ value: "side", label: "Side by side" },
						{ value: "difference", label: "Difference" },
					]}
					onChange={(next) => {
						wipe.current.cut = 50;
						setMode(next);
					}}
				/>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-2 border-b p-2 text-sm text-fd-muted-foreground">
				<Select
					value={document}
					onValueChange={(v) => {
						setDocument(v);
						setPage(0);
					}}
				>
					<Select.Trigger className="h-8 w-36 rounded-sm" aria-label="Document">
						<Select.Value />
					</Select.Trigger>
					<Select.Content>
						{documents.map((d) => (
							<Select.Item key={d} value={d}>
								{titles[d]}
							</Select.Item>
						))}
					</Select.Content>
				</Select>
				{mode !== "side" && (
					<div className="flex flex-wrap items-center gap-2">
						{picker(first, setFirst, "Left program")}
						<span>{mode === "slider" ? "against" : "minus"}</span>
						{picker(second, setSecond, "Right program")}
					</div>
				)}
			</div>

			<div
				ref={viewer}
				className="aspect-[612/792] max-h-[38.25rem] w-full overflow-auto bg-fd-secondary p-4"
			>
				<div
					className={cn(
						"flex min-h-full w-max min-w-full",
						width === 0 && "invisible",
					)}
				>
					<div className="m-auto">
						{mode === "side" && (
							<div
								className="grid gap-4"
								style={{
									gridTemplateColumns: `repeat(${columns}, ${width}px)`,
								}}
							>
								{programs.map((program) => (
									<figure
										key={program}
										className="m-0 flex min-w-0 flex-col gap-2"
									>
										<figcaption className="inline-flex items-center gap-2 text-sm font-medium">
											<Swatch program={program} />
											{names[program]}
										</figcaption>
										<div className="aspect-[612/792] overflow-hidden border shadow-sm">
											{sheet(program)}
										</div>
									</figure>
								))}
							</div>
						)}

						{mode === "slider" && (
							<div
								ref={stage}
								role="slider"
								tabIndex={0}
								aria-label={`Wipe between ${names[first]} and ${names[second]}`}
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={50}
								onPointerMove={follow}
								onPointerDown={(event) => {
									event.currentTarget.setPointerCapture(event.pointerId);
									follow(event);
								}}
								onPointerLeave={() => slide(50, "elastic.out(1, 0.55)", 1.2)}
								onKeyDown={(event) => {
									const step = { ArrowLeft: -5, ArrowRight: 5 }[event.key];
									if (step) {
										event.preventDefault();
										slide(wipe.current.cut + step);
									}
								}}
								style={{ width }}
								className="relative aspect-[612/792] cursor-ew-resize touch-none overflow-hidden border shadow-sm outline-none select-none [--cut:50%] focus-visible:ring-2 focus-visible:ring-fd-ring"
							>
								<div className="absolute inset-0">{sheet(second)}</div>
								<div className="absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--cut))_0_0)]">
									{sheet(first)}
								</div>
								<div className="pointer-events-none absolute inset-y-0 left-[var(--cut)] w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.25)]">
									<span className="absolute top-1/2 left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-zinc-300 bg-white text-zinc-900 shadow-md">
										<span className="flex">
											<ChevronLeft className="-mr-1 size-3.5" />
											<ChevronRight className="-ml-1 size-3.5" />
										</span>
									</span>
								</div>
							</div>
						)}

						{mode === "difference" && (
							<div
								style={{ width }}
								className="relative aspect-[612/792] overflow-hidden border shadow-sm"
							>
								<div className="absolute inset-0">{sheet(second)}</div>
								<div className="absolute inset-0 mix-blend-difference">
									{sheet(first)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-4 py-2">
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() => setPage(shown - 1)}
						disabled={shown === 0}
						aria-label="Previous page"
					>
						<ChevronLeft />
					</Button>
					<span className="min-w-24 text-center text-sm tabular-nums">
						Page {shown + 1} of {count}
					</span>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() => setPage(shown + 1)}
						disabled={shown >= count - 1}
						aria-label="Next page"
					>
						<ChevronRight />
					</Button>
					<span aria-hidden className="mx-2 h-4 w-px bg-fd-border" />
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() => zoom(scales[step - 1])}
						disabled={step <= 0}
						aria-label="Zoom out"
					>
						<Minus />
					</Button>
					<button
						type="button"
						title="Back to 100%"
						onClick={() => zoom(1)}
						className="min-w-12 rounded-sm px-1 py-1 text-center text-sm tabular-nums transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
					>
						{Math.round(scale * 100)}%
					</button>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() => zoom(scales[step + 1])}
						disabled={step >= scales.length - 1}
						aria-label="Zoom in"
					>
						<Plus />
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fd-muted-foreground">
					<span className="inline-flex items-center gap-1.5">
						<Download className="size-3.5" />
						PDF
					</span>
					{programs.map((program) => (
						<a
							key={program}
							href={`/benchmark/pdfs/${document}-${program}.pdf`}
							className="underline-offset-4 hover:text-fd-foreground hover:underline"
						>
							{names[program]}
						</a>
					))}
				</div>
			</div>
		</Card>
	);
}

const limit = 160;

/** Each test document's source, LaTeX or Typst, in the docs' own tabbed code block. */
export function Sources() {
	const [document, setDocument] = useState("structure");
	const [language, setLanguage] = useState<"tex" | "typ">("tex");
	const [texts, setTexts] = useState<Record<string, string>>({});
	const [whole, setWhole] = useState(false);
	const sources = data.sources as Record<
		string,
		{ lines: number; bytes: number }
	>;
	const file =
		document === "references.bib"
			? "references.bib"
			: `${document}.${language}`;
	const meta = sources[file];

	useEffect(() => {
		if (texts[file] !== undefined) return;
		let live = true;
		fetch(`/benchmark/corpus/${file}`)
			.then((response) => response.text())
			.then((text) => live && setTexts((all) => ({ ...all, [file]: text })))
			.catch(
				() =>
					live &&
					setTexts((all) => ({
						...all,
						[file]: "The file could not be loaded.",
					})),
			);
		return () => {
			live = false;
		};
	}, [file, texts]);

	const text = texts[file];
	const lines = useMemo(() => (text ? text.split("\n") : []), [text]);
	const cut = !whole && lines.length > limit;
	const comment = file.endsWith(".typ") ? "//" : "%";
	const kind = file.endsWith(".bib")
		? "bibtex"
		: file.endsWith(".typ")
			? "typst"
			: "latex";

	return (
		<CodeBlockTabs
			value={document}
			onValueChange={(v: string) => {
				setDocument(v);
				setWhole(false);
			}}
			className="not-prose my-6 overflow-hidden"
		>
			<CodeBlockTabsList>
				{[...documents, "references.bib"].map((d) => (
					<CodeBlockTabsTrigger key={d} value={d}>
						{titles[d] ?? d}
					</CodeBlockTabsTrigger>
				))}
			</CodeBlockTabsList>
			<CodeBlockTab value={document}>
				{text === undefined ? (
					<div className="h-60 animate-pulse border-t bg-fd-secondary" />
				) : (
					<DynamicCodeBlock
						lang={kind}
						code={
							cut
								? `${lines.slice(0, limit).join("\n")}\n${comment} … ${(lines.length - limit).toLocaleString()} more lines`
								: text
						}
						codeblock={{
							title: `${file} · ${meta.lines.toLocaleString()} lines · ${(meta.bytes / 1024).toFixed(1)} KB`,
							// The documents' paragraphs are one long line each: wrap them rather than scroll sideways.
							viewportProps: {
								className:
									"max-h-[28rem] [&_pre]:w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words",
							},
							Actions: ({ className, children }) => (
								<div className={cn(className, "flex items-center gap-1")}>
									{document !== "references.bib" && (
										<div
											role="group"
											aria-label="Language"
											className="flex items-center gap-0.5 text-xs font-medium"
										>
											{(["tex", "typ"] as const).map((l) => (
												<button
													key={l}
													type="button"
													aria-pressed={language === l}
													onClick={() => {
														setLanguage(l);
														setWhole(false);
													}}
													className="rounded-md px-2 py-1 transition-colors hover:text-fd-accent-foreground aria-pressed:bg-fd-accent aria-pressed:text-fd-accent-foreground"
												>
													{l === "tex" ? "LaTeX" : "Typst"}
												</button>
											))}
										</div>
									)}
									<a
										href={`/benchmark/corpus/${file}`}
										download
										aria-label={`Download ${file}`}
										className="inline-flex size-7 items-center justify-center rounded-md transition-colors hover:text-fd-accent-foreground"
									>
										<Download className="size-3.5" />
									</a>
									{children}
								</div>
							),
						}}
					/>
				)}
				{cut && (
					<div className="flex items-center justify-between gap-2 border-t px-4 py-2 text-sm text-fd-muted-foreground">
						<span>
							Showing {limit} of {lines.length.toLocaleString()} lines
						</span>
						<Button variant="ghost" size="sm" onClick={() => setWhole(true)}>
							Show all
						</Button>
					</div>
				)}
			</CodeBlockTab>
		</CodeBlockTabs>
	);
}

/** Where and when the run happened, and with what, in the docs' own table style. */
export function Machine() {
	const { machine, versions } = data;
	const date = (iso: string) =>
		new Date(iso).toLocaleString("en-GB", {
			dateStyle: "medium",
			timeStyle: "short",
			timeZone: "UTC",
		});
	const facts: [string, string][] = [
		[
			"Processor",
			`${machine.cpu.replace(/\s+/g, " ")}, ${machine.cores} cores, ${machine.threads} threads`,
		],
		["Memory", `${Math.round(machine.memory / 1073741824)} GB`],
		["System", machine.os],
		["mLaTeX", `${versions.mlatex}, Clang 22 release build`],
		["pdfLaTeX", versions.pdflatex],
		["XeLaTeX", versions.xelatex],
		[
			"LuaLaTeX",
			(versions as Record<string, string>).lualatex ?? "not measured",
		],
		["Typst", (versions as Record<string, string>).typst ?? "not measured"],
		[
			"Measured",
			`${data.samples.toLocaleString()} builds in ${data.rounds} rounds, after ${data.warmups} warm-up builds of each`,
		],
		["Run", `${date(data.started)} to ${date(data.finished)} UTC`],
		["Idle load", `${machine.idleBefore}% before, ${machine.idleAfter}% after`],
	];
	return (
		<div className="relative my-6 overflow-auto prose-no-margin">
			<table>
				<tbody>
					{facts.map(([term, detail]) => (
						<tr key={term}>
							<th scope="row" className="w-32 text-left whitespace-nowrap">
								{term}
							</th>
							<td>{detail}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
