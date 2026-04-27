"use client";

import { CodeBlock } from "@prostha/ui/src/components/code-block";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Release {
	tag: string;
	title: string;
	content: string;
	date: string;
	url: string;
	expandable: boolean;
}

export function Changelog({ releases }: { releases: Release[] }) {
	const root = useRef<Record<string, HTMLDivElement | null>>({});
	const [tags, setTags] = useState<Record<string, boolean>>({});

	return (
		<div className="flex flex-col">
			{releases.map((item) => {
				return (
					<div
						key={item.tag}
						ref={(node) => {
							root.current[item.tag] = node;
						}}
						className="group border-b border-dashed px-5 sm:px-6 lg:px-8 py-16 first:pt-8"
					>
						<div className="flex items-baseline mb-4">
							<div className="flex items-center gap-3">
								<Link
									href={item.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-2xl font-medium tracking-tight text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
								>
									{item.title || item.tag}
								</Link>
								{item.title && item.title !== item.tag && (
									<span className="text-xs font-mono text-muted-foreground px-1.5 py-0.5 border bg-muted rounded-sm">
										{item.tag}
									</span>
								)}
							</div>
							<time className="text-xs font-mono tracking-tight text-muted-foreground shrink-0 ml-4">
								{item.date}
							</time>
						</div>

						<div>
							<div className="relative">
								<div
									className={cn(
										"changelog-content max-w-3xl",
										item.expandable &&
											!tags[item.tag] &&
											"max-h-100 overflow-y-hidden",
									)}
								>
									<Markdown
										remarkPlugins={[remarkGfm]}
										components={{
											h2: ({ children, ...props }) => (
												<h2
													className="text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 mt-6 mb-3 [&_code]:text-xl"
													{...props}
												>
													{children}
												</h2>
											),
											h3: ({ children, ...props }) => (
												<h3
													className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mt-5 mb-2 tracking-tight [&_code]:text-lg"
													{...props}
												>
													{children}
												</h3>
											),
											p: (props) => (
												<p
													className="text-sm text-muted-foreground leading-7 my-2"
													{...props}
												/>
											),
											ul: (props) => (
												<ul
													className="space-y-1.5 my-3 in-[ul]:ml-2 in-[ul]:mt-1.5 in-[ul]:mb-0"
													{...props}
												/>
											),
											li: (props) => (
												<li
													className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-foreground/50"
													{...props}
												/>
											),
											a: ({
												className,
												...props
											}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
												className?: string;
											}) => (
												<a
													target="_blank"
													rel="noopener noreferrer"
													className={cn(
														"font-medium text-neutral-600 dark:text-neutral-300 underline decoration-dashed underline-offset-4 hover:text-neutral-900 dark:hover:text-white transition-colors has-[img]:inline-flex has-[img]:align-middle has-[img]:no-underline",
														className,
													)}
													{...props}
												/>
											),
											strong: (props) => (
												<strong
													className="font-medium text-foreground/90"
													{...props}
												/>
											),
											ol: (props) => (
												<ol
													className="list-decimal space-y-1.5 my-3 ml-6 text-sm text-muted-foreground"
													{...props}
												/>
											),
											hr: () => null,
											img: (props) => (
												<img
													className="inline-block size-6 rounded-full border border-foreground/10 bg-background opacity-90 mx-0.5 align-middle shadow-sm"
													{...props}
													style={{ maxWidth: "100%" }}
													alt={props.alt || ""}
												/>
											),
											pre: ({ children }) => {
												const child = children as React.ReactElement<{
													className?: string;
													children?: string;
												}>;
												return (
													<div className="my-4">
														<CodeBlock
															language={
																(child?.props?.className || "").replace(
																	/language-/,
																	"",
																) || "text"
															}
															code={
																typeof child?.props?.children === "string"
																	? child.props.children.trim()
																	: ""
															}
															codeblock={{ className: "border rounded-md" }}
														/>
													</div>
												);
											},
											code: ({ className, children, ...props }) => {
												if (className?.includes("language-")) {
													return (
														<code className={className} {...props}>
															{children}
														</code>
													);
												}
												return (
													<code
														className="text-xs font-mono bg-muted px-1.5 py-0.5 text-neutral-600 dark:text-neutral-300 rounded-sm"
														{...props}
													>
														{children}
													</code>
												);
											},
											table: (props) => (
												<div className="my-4 overflow-x-auto">
													<table
														className="w-full text-sm border-collapse"
														{...props}
													/>
												</div>
											),
											tr: (props) => (
												<tr
													className="border-b border-foreground/6 transition-colors hover:bg-muted/50"
													{...props}
												/>
											),
											th: (props) => (
												<th
													className="h-10 px-3 text-left align-middle font-bold text-muted-foreground text-xs"
													{...props}
												/>
											),
											td: (props) => (
												<td
													className="px-3 py-2.5 align-middle text-sm"
													{...props}
												/>
											),
										}}
									>
										{item.content}
									</Markdown>
								</div>
								{item.expandable && !tags[item.tag] && (
									<div className="h-20 absolute inset-x-0 bottom-0 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
								)}
							</div>
							{item.expandable && (
								<button
									type="button"
									onClick={() => {
										if (tags[item.tag]) {
											setTags((current) => ({ ...current, [item.tag]: false }));
											root.current[item.tag]?.scrollIntoView({
												behavior: "smooth",
												block: "start",
											});
										} else {
											setTags((current) => ({ ...current, [item.tag]: true }));
										}
									}}
									className="inline-flex items-center gap-1.5 mt-12 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
								>
									<ChevronDown
										className={cn(
											"size-3.5 transition-transform duration-200",
											tags[item.tag] && "rotate-180",
										)}
									/>
									{tags[item.tag] ? "Collapse release" : "Expand release"}
								</button>
							)}
						</div>
					</div>
				);
			})}

			<div className="px-5 sm:px-6 lg:px-8 py-12">
				<Link
					href="https://github.com/prosthaphaeresis/docs/releases"
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
				>
					View all releases on GitHub &rarr;
				</Link>
			</div>
		</div>
	);
}
