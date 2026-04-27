"use client";

import { cn } from "@prostha/ui/src/lib/utils";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export function Endpoint({
	path,
	method,
	className,
}: {
	path: string;
	method: Method;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative flex items-center w-full gap-2 px-3.5 py-1 border-b border-border bg-fd-muted/80 group",
				className,
			)}
		>
			<span
				className={cn(
					"text-xs font-bold font-mono uppercase",
					method === "GET" && "text-green-600 dark:text-green-500",
					method === "POST" && "text-yellow-600 dark:text-yellow-600",
					method === "PUT" && "text-blue-600 dark:text-blue-400",
					method === "DELETE" && "text-red-600 dark:text-red-400",
				)}
			>
				{method}
			</span>
			<span className="font-mono text-[13px] text-foreground/80 font-medium">
				{path}
			</span>
		</div>
	);
}
