"use client";

import type * as React from "react";

import { cn } from "../lib/utils";

const Root = ({ className, ...props }: React.ComponentProps<"table">) => (
	<div data-slot="table-container" className="relative w-full overflow-x-auto">
		<table
			data-slot="table"
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	</div>
);

const Header = ({ className, ...props }: React.ComponentProps<"thead">) => (
	<thead
		data-slot="table-header"
		className={cn("[&_tr]:border-b", className)}
		{...props}
	/>
);

const Body = ({ className, ...props }: React.ComponentProps<"tbody">) => (
	<tbody
		data-slot="table-body"
		className={cn("[&_tr:last-child]:border-0", className)}
		{...props}
	/>
);

const Footer = ({ className, ...props }: React.ComponentProps<"tfoot">) => (
	<tfoot
		data-slot="table-footer"
		className={cn(
			"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
			className,
		)}
		{...props}
	/>
);

const Row = ({ className, ...props }: React.ComponentProps<"tr">) => (
	<tr
		data-slot="table-row"
		className={cn(
			"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
			className,
		)}
		{...props}
	/>
);

const Head = ({ className, ...props }: React.ComponentProps<"th">) => (
	<th
		data-slot="table-head"
		className={cn(
			"text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
			className,
		)}
		{...props}
	/>
);

const Cell = ({ className, ...props }: React.ComponentProps<"td">) => (
	<td
		data-slot="table-cell"
		className={cn(
			"p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
			className,
		)}
		{...props}
	/>
);

const Caption = ({ className, ...props }: React.ComponentProps<"caption">) => (
	<caption
		data-slot="table-caption"
		className={cn("text-muted-foreground mt-4 text-sm", className)}
		{...props}
	/>
);

export const Table = Object.assign(Root, {
	Header,
	Body,
	Footer,
	Row,
	Head,
	Cell,
	Caption,
});
