"use client";

import type * as React from "react";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const variants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start **:[svg]:size-4 **:[svg]:translate-y-0.5 **:[svg]:text-current",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"text-destructive bg-card **:[svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
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
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof variants>) => (
	<div
		data-slot="alert"
		role="alert"
		className={cn(variants({ variant }), className)}
		{...props}
	/>
);

const Title = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div
		data-slot="alert-title"
		className={cn(
			"col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
			className,
		)}
		{...props}
	/>
);

const Description = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div
		data-slot="alert-description"
		className={cn(
			"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm **:[p]:leading-relaxed",
			className,
		)}
		{...props}
	/>
);

export const Alert = Object.assign(Root, {
	Title: Title,
	Description: Description,
});
