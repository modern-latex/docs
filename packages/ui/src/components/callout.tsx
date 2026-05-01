"use client";

import type * as React from "react";

import { cva } from "class-variance-authority";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

import { cn } from "../lib/utils";

const Maps = {
	info: <Info className="size-5 fill-blue-500 text-fd-card" />,
	warn: <TriangleAlert className="size-5 fill-orange-500 text-fd-card" />,
	error: <CircleX className="size-5 fill-red-500 text-fd-card" />,
	success: <CircleCheck className="size-5 fill-green-500 text-fd-card" />,
};

const variants = cva(
	"my-4 flex gap-2 border border-s-2 bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md border-dashed rounded-none **:[svg]:pointer-events-none",
	{
		variants: {
			type: {
				info: "border-s-blue-500/50",
				warn: "border-s-orange-500/50",
				error: "border-s-red-500/50",
				success: "border-s-green-500/50",
			},
		},
	},
);
const Root = ({
	className,
	children,
	title,
	type = "info",
	icon,
	...props
}: Omit<React.ComponentProps<"div">, "title"> & {
	title?: React.ReactNode;
	type?: "info" | "warn" | "error" | "success" | "warning";
	icon?: React.ReactNode;
}) => {
	const fallback = type === "warning" ? "warn" : type;

	return (
		<div
			data-slot="callout"
			className={cn(variants({ type: fallback }), className)}
			{...props}
		>
			{icon ?? Maps[fallback]}
			<div className="min-w-0 flex flex-1 flex-col gap-2">
				{title ? <p className="font-medium my-0!">{title}</p> : null}
				<div className="text-fd-muted-foreground prose-no-margin empty:hidden">
					{children}
				</div>
			</div>
		</div>
	);
};

export const Callout = Object.assign(Root, {
	Variants: variants,
});
