"use client";

import type * as React from "react";

import { Toolbar as ToolbarPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

const control =
	"inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1.5 rounded-sm px-1.5 text-xs text-muted-foreground outline-hidden transition-colors select-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const Root = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) => (
	<ToolbarPrimitive.Root
		data-slot="toolbar"
		className={cn("flex items-center gap-0.5", className)}
		{...props}
	/>
);

const Button = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button>) => (
	<ToolbarPrimitive.Button
		data-slot="toolbar-button"
		className={cn(control, className)}
		{...props}
	/>
);

const Link = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) => (
	<ToolbarPrimitive.Link
		data-slot="toolbar-link"
		className={cn(control, className)}
		{...props}
	/>
);

const Separator = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) => (
	<ToolbarPrimitive.Separator
		data-slot="toolbar-separator"
		className={cn("mx-1 h-4 w-px shrink-0 bg-border", className)}
		{...props}
	/>
);

const ToggleGroup = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) => (
	<ToolbarPrimitive.ToggleGroup
		data-slot="toolbar-toggle-group"
		className={cn("flex items-center gap-0.5", className)}
		{...props}
	/>
);

const ToggleItem = ({
	className,
	...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) => (
	<ToolbarPrimitive.ToggleItem
		data-slot="toolbar-toggle-item"
		className={cn(control, className)}
		{...props}
	/>
);

export const Toolbar = Object.assign(Root, {
	Button,
	Link,
	Separator,
	ToggleGroup,
	ToggleItem,
});
