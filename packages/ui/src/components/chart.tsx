"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../lib/utils";

/** One set of bars: the key it reads from each row, its name, and its colour. */
export interface Series {
	key: string;
	label: string;
	color: string;
}

interface ChartProps {
	/** One group of bars per row. */
	rows: Record<string, string | number>[];
	/** The key that names each row's group, set under its bars. */
	index: string;
	series: Series[];
	/** Called with the group under the pointer, or null when it leaves, so a page can show its values. */
	onHover?: (group: number | null) => void;
	/** What the chart shows, for screen readers. */
	label: string;
	className?: string;
}

/**
 * Grouped bars that grow in and fade the groups not under the pointer: the
 * parts of bklit's bar chart (MIT) the docs use, drawn without a charting
 * library. Nothing floats over the bars; the page shows the hovered values.
 */
export function Chart({
	rows,
	index,
	series,
	onHover,
	label,
	className,
}: ChartProps) {
	const frame = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [hover, setHover] = useState<number | null>(null);
	const choose = (group: number | null) => {
		setHover(group);
		onHover?.(group);
	};
	const [grown, setGrown] = useState(false);

	useEffect(() => {
		const element = frame.current;
		if (!element) return;
		const observer = new ResizeObserver(([entry]) =>
			setSize({
				width: Math.floor(entry.contentRect.width),
				height: Math.floor(entry.contentRect.height),
			}),
		);
		observer.observe(element);
		const start = requestAnimationFrame(() => setGrown(true));
		return () => {
			observer.disconnect();
			cancelAnimationFrame(start);
		};
	}, []);

	const { width, height } = size;
	const narrow = width < 520;
	const top = 12;
	const bottom = 28;
	const plot = Math.max(0, height - top - bottom);

	// The scale's top is rounded up to 1, 2 or 5 times a power of ten, so the gridlines fall on round values.
	const peak = Math.max(
		...rows.flatMap((row) => series.map((one) => Number(row[one.key]))),
	);
	const magnitude = 10 ** Math.floor(Math.log10(peak / 4));
	const step = [1, 2, 5, 10]
		.map((factor) => factor * magnitude)
		.find((candidate) => candidate * 4 >= peak) as number;
	const ceiling = Math.ceil(peak / step) * step;
	const ticks = Array.from(
		{ length: Math.round(ceiling / step) + 1 },
		(_, count) => count * step,
	);

	const band = width / rows.length;
	const gap = 2;
	const bar = Math.max(
		1,
		(band * 0.72 - gap * (series.length - 1)) / series.length,
	);
	const level = (value: number) => top + plot - (value / ceiling) * plot;

	return (
		<div
			ref={frame}
			className={cn("relative aspect-4/3 w-full sm:aspect-video", className)}
			onMouseLeave={() => choose(null)}
		>
			{width > 0 && (
				<svg
					width={width}
					height={height}
					role="img"
					aria-label={label}
					className="block overflow-visible select-none"
				>
					{ticks.map((tick) => (
						<line
							key={tick}
							x1={0}
							x2={width}
							y1={level(tick)}
							y2={level(tick)}
							className="stroke-border"
							strokeDasharray="3 4"
						/>
					))}
					{rows.map((row, group) => {
						const left =
							band * group + (band - (bar + gap) * series.length + gap) / 2;
						const named = !narrow || group % 2 === 0;
						return (
							<g
								key={String(row[index])}
								onMouseEnter={() => choose(group)}
								onClick={() => choose(group)}
								className="transition-opacity duration-200"
								opacity={hover === null || hover === group ? 1 : 0.3}
							>
								<rect
									x={band * group}
									y={0}
									width={band}
									height={height}
									fill="transparent"
								/>
								{series.map((one, place) => {
									const value = Number(row[one.key]);
									const tall = Math.max(1, (value / ceiling) * plot);
									return (
										<rect
											key={one.key}
											x={left + place * (bar + gap)}
											y={top + plot - tall}
											width={bar}
											height={tall}
											fill={one.color}
											style={{
												transformBox: "fill-box",
												transformOrigin: "bottom",
												transform: grown ? "scaleY(1)" : "scaleY(0)",
												transition: `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${group * 40}ms`,
											}}
										/>
									);
								})}
								{(named || hover === group) && (
									<text
										x={band * group + band / 2}
										y={height - 8}
										textAnchor="middle"
										className={cn(
											"text-[11px]",
											hover === group
												? "fill-foreground font-medium"
												: "fill-muted-foreground",
										)}
									>
										{String(row[index])}
									</text>
								)}
							</g>
						);
					})}
				</svg>
			)}
		</div>
	);
}
