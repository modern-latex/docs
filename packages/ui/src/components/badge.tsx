"use client";

import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const variants = cva(
	"inline-flex items-center justify-center rounded border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden shadow-xs",
	{
		variants: {
			variant: {
				default:
					"border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 [a&]:hover:bg-zinc-800 dark:[a&]:hover:bg-zinc-200",
				secondary:
					"border-zinc-200 dark:border-zinc-800/80 bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50 [a&]:hover:bg-zinc-200 dark:[a&]:hover:bg-zinc-800",
				destructive:
					"border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-400 [a&]:hover:bg-red-100 dark:[a&]:hover:bg-red-950/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 [a&]:hover:bg-zinc-50 dark:[a&]:hover:bg-zinc-900 [a&]:hover:text-zinc-900 dark:[a&]:hover:text-zinc-50",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Root = ({
	className,
	variant,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof variants> & {
		asChild?: boolean;
	}) => {
	const Tag = asChild ? Slot : "span";

	return (
		<Tag
			data-slot="badge"
			className={cn(variants({ variant }), className)}
			{...props}
		/>
	);
};

export const Badge = Object.assign(Root, {
	Variants: variants,
});
