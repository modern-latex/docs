"use client";

import type * as React from "react";

import { ChevronRightIcon } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

const item =
	"relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

const surface =
	"z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";

const Root = (
	props: React.ComponentProps<typeof ContextMenuPrimitive.Root>,
) => <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;

const Trigger = (
	props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>,
) => (
	<ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
);

const Content = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			data-slot="context-menu-content"
			className={cn(surface, className)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
);

const Item = ({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
	variant?: "default" | "destructive";
}) => (
	<ContextMenuPrimitive.Item
		data-slot="context-menu-item"
		className={cn(
			item,
			variant === "destructive" &&
				"text-destructive data-[highlighted]:text-destructive [&_svg]:!text-destructive",
			className,
		)}
		{...props}
	/>
);

const Label = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label>) => (
	<ContextMenuPrimitive.Label
		data-slot="context-menu-label"
		className={cn(
			"px-2 py-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase",
			className,
		)}
		{...props}
	/>
);

const Separator = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) => (
	<ContextMenuPrimitive.Separator
		data-slot="context-menu-separator"
		className={cn("-mx-1 my-1 h-px bg-border", className)}
		{...props}
	/>
);

/** The keys that do what an item does, at its right. */
const Shortcut = ({ className, ...props }: React.ComponentProps<"span">) => (
	<span
		data-slot="context-menu-shortcut"
		className={cn(
			"ml-auto pl-6 font-mono text-[11px] tracking-widest text-muted-foreground",
			className,
		)}
		{...props}
	/>
);

const Sub = (props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) => (
	<ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
);

const SubTrigger = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger>) => (
	<ContextMenuPrimitive.SubTrigger
		data-slot="context-menu-sub-trigger"
		className={cn(item, "data-[state=open]:bg-accent", className)}
		{...props}
	>
		{children}
		<ChevronRightIcon className="ml-auto size-4" />
	</ContextMenuPrimitive.SubTrigger>
);

const SubContent = ({
	className,
	...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.SubContent
			data-slot="context-menu-sub-content"
			className={cn(surface, className)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
);

export const ContextMenu = Object.assign(Root, {
	Trigger,
	Content,
	Item,
	Label,
	Separator,
	Shortcut,
	Sub,
	SubTrigger,
	SubContent,
});
