"use client";

import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FeedbackProps {
	content: string;
	className?: string;
}

export function Feedback({ content, className }: FeedbackProps) {
	const [status, setStatus] = useState<"positive" | "negative" | null>(null);
	const [copied, setCopied] = useState(false);

	return (
		<div
			className={cn(
				"flex items-center gap-1 mt-3 pt-2 border-t border-fd-border/30",
				className,
			)}
		>
			<button
				type="button"
				onClick={() => {
					if (status !== "positive") {
						setStatus("positive");
					}
				}}
				className={cn(
					"inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
					status === "positive"
						? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
						: "hover:bg-fd-accent hover:text-fd-accent-foreground text-muted-foreground",
				)}
				title="Helpful"
			>
				{status === "positive" ? (
					<Check className="h-3.5 w-3.5 text-green-600 animate-in fade-in duration-200" />
				) : (
					<ThumbsUp className="h-3.5 w-3.5 transition-all duration-200" />
				)}
			</button>

			<button
				type="button"
				onClick={() => {
					if (status !== "negative") {
						setStatus("negative");
					}
				}}
				className={cn(
					"inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
					status === "negative"
						? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
						: "hover:bg-fd-accent hover:text-fd-accent-foreground text-muted-foreground",
				)}
				title="Not helpful"
			>
				{status === "negative" ? (
					<Check className="h-3.5 w-3.5 text-green-600 animate-in fade-in duration-200" />
				) : (
					<ThumbsDown className="h-3.5 w-3.5 transition-all duration-200" />
				)}
			</button>

			<button
				type="button"
				onClick={() => {
					if (copied) return;

					navigator.clipboard
						.writeText(content)
						.then(() => {
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
						})
						.catch((error) => {
							console.error("Failed to copy text to clipboard:", error);
						});
				}}
				className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground text-muted-foreground transition-colors ml-auto lg:ml-0"
				title={copied ? "Copied!" : "Copy message"}
			>
				{copied ? (
					<Check className="h-3.5 w-3.5 text-green-600" />
				) : (
					<Copy className="h-3.5 w-3.5" />
				)}
			</button>
		</div>
	);
}
