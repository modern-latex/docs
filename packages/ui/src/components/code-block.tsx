"use client";

import type { HighlightOptions } from "fumadocs-core/highlight";
import { useShiki } from "fumadocs-core/highlight/client";
import { Check, Copy } from "lucide-react";
import type {
	ComponentProps,
	CSSProperties,
	FC,
	HTMLAttributes,
	ReactNode,
} from "react";
import { createContext, Suspense, use, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface CodeBlockProps extends ComponentProps<"figure"> {
	icon?: ReactNode;
	allowCopy?: boolean;
	keepBackground?: boolean;
	viewportProperties?: HTMLAttributes<HTMLElement>;
	"data-line-numbers"?: boolean;
	"data-line-numbers-start"?: number;
	actions?: (props: { className?: string; children?: ReactNode }) => ReactNode;
	language: string;
	code: string;
	wrapInSuspense?: boolean;
	options?: Omit<HighlightOptions, "lang"> & {
		components?: Record<string, FC>;
	};
	codeblock?: Partial<CodeBlockProps>;
}

const Context = createContext<string | null>(null);

export function CodeBlock({
	title,
	allowCopy: allow,
	keepBackground: keep = false,
	icon,
	viewportProperties: view,
	actions = (properties) => (
		<div {...properties} className={cn("empty:hidden", properties.className)} />
	),
	language: lang,
	code,
	wrapInSuspense: wrap = true,
	options,
	codeblock: block,
	className,
	...props
}: CodeBlockProps) {
	const context = use(Context);
	const root = useRef<HTMLDivElement>(null);
	const id = useId();

	const [state, setState] = useState(false);
	const timeout = useRef<number | null>(null);

	const Node = () =>
		useShiki(code, {
			lang,
			...options,
			components: {
				pre: (pre: ComponentProps<"pre">) => {
					const allowCopy = allow ?? !context;

					return (
						<figure
							dir="ltr"
							{...pre}
							{...props}
							{...block}
							className={cn(
								context
									? [
											cn(
												"bg-fd-secondary",
												keep &&
													"bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
											),
											"rounded-lg",
										]
									: "my-4 rounded-lg bg-fd-card",
								"group shiki relative border shadow-sm outline-none not-prose overflow-hidden text-sm my-0 border-t-0 rounded-none",
								pre.className,
								className,
							)}
						>
							{title ? (
								<div
									className={cn(
										"group flex text-fd-muted-foreground items-center gap-2 ps-3 h-9.5 pr-1 bg-fd-muted",
										context && "border-b",
									)}
								>
									{typeof icon === "string" ? (
										<div
											className="[&_svg]:size-3.5"
											ref={(element) => {
												if (element) {
													element.innerHTML = icon;
												}
											}}
										/>
									) : (
										icon
									)}
									<figcaption className="flex-1 truncate">{title}</figcaption>
									{actions({
										children: allowCopy && (
											<Button
												variant="ghost"
												size="icon"
												className="transition-opacity size-7 border-none opacity-0 group-hover:opacity-100"
												aria-label="Copy Text"
												onClick={() => {
													if (timeout.current)
														window.clearTimeout(timeout.current);
													const target =
														root.current?.getElementsByTagName("pre").item(0) ??
														root.current;
													if (!target) return;
													const clone = target.cloneNode(true) as HTMLElement;
													for (const node of Array.from(
														clone.querySelectorAll(".nd-copy-ignore"),
													)) {
														node.remove();
													}
													void navigator.clipboard.writeText(
														clone.textContent ?? "",
													);
													setState(true);
													timeout.current = window.setTimeout(
														() => setState(false),
														1500,
													);
												}}
											>
												<Check
													className={cn(
														"size-3.5 transition-transform",
														!state && "scale-0",
													)}
												/>
												<Copy
													className={cn(
														"absolute size-3.5 transition-transform",
														state && "scale-0",
													)}
												/>
											</Button>
										),
									})}
								</div>
							) : (
								actions({
									className:
										"absolute top-1 right-1 z-2 text-fd-muted-foreground",
									children: allowCopy && (
										<Button
											variant="ghost"
											size="icon"
											className="transition-opacity size-7 border-none opacity-0 group-hover:opacity-100"
											aria-label="Copy Text"
											onClick={() => {
												if (timeout.current)
													window.clearTimeout(timeout.current);
												const target =
													root.current?.getElementsByTagName("pre").item(0) ??
													root.current;
												if (!target) return;
												const clone = target.cloneNode(true) as HTMLElement;
												for (const node of Array.from(
													clone.querySelectorAll(".nd-copy-ignore"),
												)) {
													node.remove();
												}
												void navigator.clipboard.writeText(
													clone.textContent ?? "",
												);
												setState(true);
												timeout.current = window.setTimeout(
													() => setState(false),
													1500,
												);
											}}
										>
											<Check
												className={cn(
													"size-3.5 transition-transform",
													!state && "scale-0",
												)}
											/>
											<Copy
												className={cn(
													"absolute size-3.5 transition-transform",
													state && "scale-0",
												)}
											/>
										</Button>
									),
								})
							)}
							<div
								ref={root}
								{...view}
								className={cn(
									!context && [
										cn(
											"bg-fd-secondary",
											keep && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
										),
										"rounded-none border border-x-0 border-b-0",
									],
									"text-[13px] overflow-auto max-h-150 bg-fd-muted/50 fd-scroll-container *:flex *:flex-col",
									view?.className,
									!title && "border-t-0",
								)}
								style={
									{
										"--padding-right": !title
											? "calc(var(--spacing) * 8)"
											: undefined,
										counterSet: props["data-line-numbers"]
											? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}`
											: undefined,
										...view?.style,
									} as CSSProperties
								}
							>
								<pre
									className={cn(
										"min-w-full w-max *:flex *:flex-col py-2",
										pre.className,
									)}
								>
									{pre.children}
								</pre>
							</div>
						</figure>
					);
				},
				...options?.components,
			},
		});

	if (wrap) {
		return (
			<Suspense
				fallback={
					<figure
						dir="ltr"
						{...props}
						{...block}
						className={cn(
							context
								? [
										cn(
											"bg-fd-secondary",
											keep && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
										),
										"rounded-lg",
									]
								: "my-4 rounded-lg bg-fd-card",
							"group shiki relative border shadow-sm outline-none not-prose overflow-hidden text-sm My-0 border-t-0 rounded-none",
							className,
						)}
					>
						<div
							ref={root}
							{...view}
							className={cn(
								!context && [
									cn(
										"bg-fd-secondary",
										keep && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)",
									),
									"rounded-none border border-x-0 border-b-0",
								],
								"text-[13px] overflow-auto max-h-150 bg-fd-muted/50 fd-scroll-container *:flex *:flex-col",
								view?.className,
								!title && "border-t-0",
							)}
						>
							<pre className="min-w-full w-max *:flex *:flex-col py-2">
								<code>
									{code.split("\n").map((line, key) => (
										<span key={`${id}-${key}`} className="line">
											{line}
										</span>
									))}
								</code>
							</pre>
						</div>
					</figure>
				}
			>
				<Node />
			</Suspense>
		);
	}

	return <Node />;
}
