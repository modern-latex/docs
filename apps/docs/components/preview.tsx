"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@mlatex/ui/src/lib/utils";
import { Loader2, ScanEye, TriangleAlert } from "lucide-react";

import { set, warm } from "@/lib/latex";
import { load } from "@/lib/pdf";

// The most pages an example shows; a class's sample is rarely more than two.
const most = 4;

/**
 * An example as mLaTeX sets it, live: the source goes to Session.snippet in
 * mLaTeX's WebAssembly worker once the example scrolls near, and mLaTeX draws
 * the pages it made onto canvases itself, on a page cropped to the example --
 * or, from a build of mLaTeX that can't, pdf.js draws its PDF.
 * Written by source.config.ts after a code block marked `preview`.
 */
export function Preview({ source }: { source: string }) {
	const frame = useRef<HTMLDivElement>(null);
	const sheets = useRef<HTMLDivElement>(null);
	const [near, setNear] = useState(false);
	const [setting, setSetting] = useState<Awaited<
		ReturnType<typeof set>
	> | null>(null);
	const [drawn, setDrawn] = useState(false);
	// Whether pdf.js couldn't read the PDF that came back.
	const [unreadable, setUnreadable] = useState(false);
	const [pages, setPages] = useState(0);
	const [width, setWidth] = useState(0);
	// Whether mLaTeX still has to load, for the wait to say so.
	const [cold, setCold] = useState(true);

	useEffect(() => {
		const element = frame.current;
		if (!element) return;
		const watcher = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setNear(true);
					watcher.disconnect();
				}
			},
			{ rootMargin: "400px 0px" },
		);
		watcher.observe(element);
		const measurer = new ResizeObserver(([entry]) => {
			if (entry) setWidth(Math.floor(entry.contentRect.width));
		});
		measurer.observe(element);
		return () => {
			watcher.disconnect();
			measurer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!near) return;
		let cancelled = false;
		setCold(!warm());
		setSetting(null);
		setDrawn(false);
		setUnreadable(false);
		void set(source).then((outcome) => {
			if (!cancelled) setSetting(outcome);
		});
		return () => {
			cancelled = true;
		};
	}, [near, source]);

	useEffect(() => {
		if (!setting?.pdf.length || !width) return;
		let cancelled = false;
		void (async () => {
			const ratio = window.devicePixelRatio || 1;
			// Each page drawn at the screen's own pixels, with its size in CSS
			// pixels: by mLaTeX itself, or, from a build of mLaTeX that can't,
			// by pdf.js from its PDF. A cropped piece is set a little larger than
			// print, to read beside the code; a whole page is fitted to the column.
			const drawings: {
				image: ImageBitmap | HTMLCanvasElement;
				width: number;
				height: number;
			}[] = [];
			let total = 0;
			if (setting.sizes) {
				total = setting.sizes.length;
				for (const [index, size] of setting.sizes.slice(0, most).entries()) {
					const scale = Math.min(
						setting.cropped ? 1.5 : 1,
						(width - 48) / size.width,
					);
					const image = await setting.draw(index, scale * ratio);
					if (!image) throw new Error("The page could not be drawn");
					drawings.push({
						image,
						width: size.width * scale,
						height: size.height * scale,
					});
				}
			} else {
				const { pdfjs, worker } = await load();
				// pdf.js takes the bytes it is given, so it gets a copy and the setting keeps its own.
				const task = pdfjs.getDocument({ data: setting.pdf.slice(), worker });
				const file = await task.promise;
				total = file.numPages;
				for (let number = 1; number <= Math.min(total, most); number++) {
					const page = await file.getPage(number);
					const viewport = page.getViewport({
						scale:
							Math.min(
								setting.cropped ? 1.5 : 1,
								(width - 48) / page.getViewport({ scale: 1 }).width,
							) * ratio,
					});
					const image = document.createElement("canvas");
					image.width = Math.floor(viewport.width);
					image.height = Math.floor(viewport.height);
					await page.render({ canvas: image, viewport }).promise;
					drawings.push({
						image,
						width: viewport.width / ratio,
						height: viewport.height / ratio,
					});
				}
				await task.destroy();
			}
			if (cancelled) {
				for (const { image } of drawings) {
					if (image instanceof ImageBitmap) image.close();
				}
				return;
			}
			sheets.current?.replaceChildren(
				...drawings.map((drawing, index) => {
					const canvas = document.createElement("canvas");
					canvas.width = Math.floor(drawing.width * ratio);
					canvas.height = Math.floor(drawing.height * ratio);
					canvas.style.width = `${Math.floor(drawing.width)}px`;
					canvas.style.height = `${Math.floor(drawing.height)}px`;
					canvas.className = "block bg-white shadow-sm ring-1 ring-black/10";
					canvas.setAttribute("role", "img");
					canvas.setAttribute(
						"aria-label",
						total > 1
							? `Page ${index + 1} of the example, as mLaTeX sets it`
							: "The example, as mLaTeX sets it",
					);
					canvas.getContext("2d")?.drawImage(drawing.image, 0, 0);
					if (drawing.image instanceof ImageBitmap) drawing.image.close();
					return canvas;
				}),
			);
			setPages(total);
			setDrawn(true);
		})().catch(() => {
			if (!cancelled) setUnreadable(true);
		});
		return () => {
			cancelled = true;
		};
	}, [setting, width]);

	const empty = setting !== null && (!setting.pdf.length || unreadable);
	const waiting = !setting || (!drawn && !empty);
	const problems = setting?.problems.filter((line) => line.trim()) ?? [];

	return (
		<figure
			ref={frame}
			className="not-prose my-6 overflow-hidden rounded-sm border bg-fd-card shadow-sm"
		>
			<figcaption className="flex items-center gap-2 border-b px-4 py-2 text-sm text-fd-muted-foreground">
				<ScanEye className="size-3.5 shrink-0" />
				<span className="font-medium text-fd-foreground">Output</span>
				<span
					className="ml-auto truncate text-xs tabular-nums"
					aria-live="polite"
				>
					{waiting && !empty
						? cold
							? "Loading mLaTeX in your browser"
							: "Setting it"
						: setting && !setting.failure
							? `Set by mLaTeX in your browser in ${Math.max(1, Math.round(setting.time))} ms`
							: ""}
				</span>
			</figcaption>
			<div className="relative bg-fd-secondary/60">
				{waiting && !empty && (
					<div
						className="flex h-40 items-center justify-center p-6"
						aria-busy="true"
					>
						<div className="flex h-full w-full max-w-sm animate-pulse items-center justify-center gap-2 bg-fd-background/70 text-xs text-fd-muted-foreground ring-1 ring-fd-border">
							<Loader2 className="size-3.5 animate-spin" />
							{cold ? "Loading mLaTeX" : "Setting the example"}
						</div>
					</div>
				)}
				<div
					ref={sheets}
					className={cn(
						"flex flex-col items-center gap-4 overflow-x-auto p-6",
						!drawn && "hidden",
					)}
				/>
				{drawn && pages > most && (
					<p className="pb-4 text-center text-xs text-fd-muted-foreground">
						The first {most} of its {pages} pages
					</p>
				)}
				{empty && (
					<p className="px-6 py-10 text-center text-sm text-fd-muted-foreground">
						{setting?.failure
							? `mLaTeX stopped while setting this example: ${setting.failure}.`
							: unreadable
								? "The PDF mLaTeX made of this example couldn't be drawn."
								: "mLaTeX made no PDF of this example."}
					</p>
				)}
			</div>
			{setting && !setting.clean && problems.length > 0 && (
				<div className="border-t px-4 py-3 text-xs">
					<p className="mb-1.5 flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
						<TriangleAlert className="size-3.5" />
						mLaTeX reported
					</p>
					<ul className="space-y-0.5 font-mono text-fd-muted-foreground">
						{problems.slice(0, 5).map((line) => (
							<li key={line} className="break-words">
								{line}
							</li>
						))}
					</ul>
				</div>
			)}
		</figure>
	);
}
