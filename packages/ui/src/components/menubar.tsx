"use client";

import type * as React from "react";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";

import { cn } from "../lib/utils";

const item =
	"relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

const surface =
	"z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";

const Root = ({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) => (
	<MenubarPrimitive.Root
		data-slot="menubar"
		className={cn("flex h-8 items-center gap-0.5", className)}
		{...props}
	/>
);

const Menu = (props: React.ComponentProps<typeof MenubarPrimitive.Menu>) => (
	<MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
);

const Trigger = ({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) => (
	<MenubarPrimitive.Trigger
		data-slot="menubar-trigger"
		className={cn(
			"flex h-7 items-center rounded-sm px-2 text-[13px] outline-hidden select-none data-[highlighted]:bg-accent data-[state=open]:bg-accent",
			className,
		)}
		{...props}
	/>
);

const Content = ({
	className,
	align = "start",
	alignOffset = -4,
	sideOffset = 6,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.Content
			data-slot="menubar-content"
			align={align}
			alignOffset={alignOffset}
			sideOffset={sideOffset}
			className={cn(surface, className)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
);

const Item = ({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
	variant?: "default" | "destructive";
}) => (
	<MenubarPrimitive.Item
		data-slot="menubar-item"
		className={cn(
			item,
			variant === "destructive" &&
				"text-destructive data-[highlighted]:text-destructive [&_svg]:!text-destructive",
			className,
		)}
		{...props}
	/>
);

const CheckboxItem = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) => (
	<MenubarPrimitive.CheckboxItem
		data-slot="menubar-checkbox-item"
		className={cn(item, "pl-8", className)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<MenubarPrimitive.ItemIndicator>
				<CheckIcon className="size-4" />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.CheckboxItem>
);

const Label = ({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.Label>) => (
	<MenubarPrimitive.Label
		data-slot="menubar-label"
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
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) => (
	<MenubarPrimitive.Separator
		data-slot="menubar-separator"
		className={cn("-mx-1 my-1 h-px bg-border", className)}
		{...props}
	/>
);

/** The keys that do what an item does, at its right. */
const Shortcut = ({ className, ...props }: React.ComponentProps<"span">) => (
	<span
		data-slot="menubar-shortcut"
		className={cn(
			"ml-auto pl-6 font-mono text-[11px] tracking-widest text-muted-foreground",
			className,
		)}
		{...props}
	/>
);

const Sub = (props: React.ComponentProps<typeof MenubarPrimitive.Sub>) => (
	<MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
);

const SubTrigger = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger>) => (
	<MenubarPrimitive.SubTrigger
		data-slot="menubar-sub-trigger"
		className={cn(item, "data-[state=open]:bg-accent", className)}
		{...props}
	>
		{children}
		<ChevronRightIcon className="ml-auto size-4" />
	</MenubarPrimitive.SubTrigger>
);

const SubContent = ({
	className,
	...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.SubContent
			data-slot="menubar-sub-content"
			className={cn(surface, className)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
);

export const Menubar = Object.assign(Root, {
	Menu,
	Trigger,
	Content,
	Item,
	CheckboxItem,
	Label,
	Separator,
	Shortcut,
	Sub,
	SubTrigger,
	SubContent,
});
