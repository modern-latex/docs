import { useId } from "react";

export function Features() {
	return (
		<div className="py-2 max-w-[1300px]">
			<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
				{grid.map((feature, i) => (
					<div
						key={feature.title}
						className="relative bg-gradient-to-b min-h-[180px] dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white px-6 py-2 overflow-hidden"
					>
						<Grid size={i * 5 + 10} />
						<p className="text-base font-bold text-neutral-800 dark:text-white relative z-0">
							{feature.title}
						</p>
						<p className="text-neutral-600 dark:text-neutral-400 text-base font-normal relative z-0">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

const grid = [
	{
		title: "Data-Oriented Architecture",
		description: "Efficient archetype-based data handling with batched loops and compact arrays for better cache use.",
	},
	{
		title: "Just-In-Time Support",
		description: "Add or change scripts on the fly without restarting the simulation core.",
	},
	{
		title: "Hardware-Agnostic Compute Pipelines",
		description: "Switch simulation tasks between fast CPU and GPU processing without manual changes.",
	},
	{
		title: "Native Graphics Integration",
		description: "Ties the simulation directly to modern, native graphical interfaces while cutting out the bloated, deprecated legacy libraries that bottleneck your builds.",
	},
	{
		title: "Blit-Ready Step Snapshotting",
		description: "Quickly saves and restores large simulation data using direct memory buffers with no extra overhead.",
	},
	{
		title: "Pre-Compiled Mathematical Functions",
		description: "Ships with an extensive gallery of optimized, pre-compiled mathematical equations ready for every simulation use case, maximizing execution speed right out of the box.",
	},
];

export const Grid = ({
	pattern,
	size,
}: {
	pattern?: number[][];
	size?: number;
}) => {
	const p = pattern ?? [
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
	];
	return (
		<div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
			<div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
				<GridPattern
					width={size ?? 20}
					height={size ?? 20}
					x="-12"
					y="4"
					squares={p}
					className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
				/>
			</div>
		</div>
	);
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
	const patternId = useId();

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern
					id={patternId}
					width={width}
					height={height}
					patternUnits="userSpaceOnUse"
					x={x}
					y={y}
				>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect
				width="100%"
				height="100%"
				strokeWidth={0}
				fill={`url(#${patternId})`}
			/>
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{squares.map(([x, y]: any, idx: number) => (
						<rect
							strokeWidth="0"
							key={`${x}-${y}-${idx}`}
							width={width + 1}
							height={height + 1}
							x={x * width}
							y={y * height}
						/>
					))}
				</svg>
			)}
		</svg>
	);
}
