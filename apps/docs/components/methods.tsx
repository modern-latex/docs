"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const context = React.createContext<{
	current: string | null;
	setCurrent: (value: string | null) => void;
}>({
	current: null,
	setCurrent: () => {},
});

const Root = ({
	className,
	defaultValue,
	...props
}: React.ComponentProps<"div"> & { defaultValue: string | null }) => {
	const [current, setCurrent] = React.useState<string | null>(
		defaultValue || null,
	);
	return (
		<context.Provider value={{ current, setCurrent }}>
			<div
				data-slot="api-method-tabs"
				className={cn("flex flex-col gap-2", className)}
				{...props}
			/>
		</context.Provider>
	);
};

const List = ({ className, ...props }: React.ComponentProps<"div">) => (
	<div
		data-slot="tabs-list"
		className={cn(
			"inline-flex justify-center items-center p-1 h-9 rounded-lg bg-muted text-muted-foreground w-fit",
			className,
		)}
		{...props}
	/>
);

const Trigger = ({
	className,
	value,
	...props
}: React.ComponentProps<"button"> & { value: string }) => {
	const { setCurrent, current } = React.useContext(context);
	return (
		<button
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			data-state={value === current ? "active" : "inactive"}
			onClick={() => setCurrent(value)}
			{...props}
		/>
	);
};

const Content = ({
	className,
	value,
	...props
}: React.ComponentProps<"div"> & { value: string }) => {
	const { current } = React.useContext(context);
	return (
		<div
			data-slot="tabs-content"
			className={cn(
				"flex-1 outline-none",
				className,
				value === current ? "block" : "hidden",
			)}
			{...props}
		/>
	);
};

export const Methods = Object.assign(Root, {
	List,
	Trigger,
	Content,
});
