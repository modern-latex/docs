"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { js_beautify } from "js-beautify";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Children, Suspense, use, useDeferredValue, useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { visit } from "unist-util-visit";

const cache = new Map<string, Promise<ReactNode>>();

export function Markdown({ text }: { text: string }) {
	const deferred = useDeferredValue(text);

	if (!cache.has(deferred)) {
		cache.set(
			deferred,
			(async () => {
				const tree = await remark()
					.use(remarkGfm)
					.use(remarkRehype)
					.use(() => (htmlTree: any) => {
						visit(htmlTree, ["text", "element"], (node: any, index, parent) => {
							if (
								(node.type === "element" && node.tagName === "pre") ||
								node.type !== "text" ||
								!parent ||
								index === undefined
							)
								return;
							Object.assign(node, {
								type: "element",
								tagName: "span",
								properties: {},
								children: node.value.split(/(?=\s)/).flatMap((word: string) =>
									word.length === 0
										? []
										: {
												type: "element",
												tagName: "span",
												properties: { class: "animate-fd-fade-in" },
												children: [{ type: "text", value: word }],
											},
								),
							});
							return "skip";
						});
					})
					.run(remark().parse(deferred));

				return toJsxRuntime(tree, {
					development: false,
					jsx,
					jsxs,
					Fragment,
					components: {
						...defaultMdxComponents,
						img: undefined,
						pre: (props: ComponentProps<"pre">) => {
							const child = Children.only(props.children) as ReactElement<{
								children: any;
								className?: string;
							}>;

							const [target, code] = useMemo(
								() => [
									(
										child.props.className?.match(/language-(\S+)/)?.[1] ??
										"text"
									).replace("mdx", "md"),
									[
										"ts",
										"tsx",
										"typescript",
										"js",
										"javascript",
										"json",
									].includes(
										(
											child.props.className?.match(/language-(\S+)/)?.[1] ??
											"text"
										).replace("mdx", "md"),
									)
										? js_beautify(
												((fn: any) => {
													const stringify = (node: any): string => {
														if (!node) return "";
														if (typeof node === "string") return node;
														if (Array.isArray(node))
															return node.map(stringify).join("");
														if (node.props?.children)
															return stringify(node.props.children);
														return "";
													};
													return stringify(fn);
												})(child.props?.children).trimEnd(),
												{
													indent_size: 2,
													indent_with_tabs: true,
													brace_style: "preserve-inline",
												},
											).trim()
										: ((fn: any) => {
												const stringify = (node: any): string => {
													if (!node) return "";
													if (typeof node === "string") return node;
													if (Array.isArray(node))
														return node.map(stringify).join("");
													if (node.props?.children)
														return stringify(node.props.children);
													return "";
												};
												return stringify(fn);
											})(child.props?.children)
												.trimEnd()
												.split("\n")
												.reduce(
													(
														total: { depth: number; text: string },
														line: string,
													) =>
														!line.trim()
															? {
																	...total,
																	text: total.text + "\n",
																}
															: ((clean) => ({
																	depth: Math.max(
																		0,
																		total.depth +
																			(clean.match(/[{[(]/g)?.length ?? 0) -
																			(clean.match(/[}\])]/g)?.length ?? 0),
																	),
																	text:
																		total.text +
																		(total.text ? "\n" : "") +
																		"\t".repeat(
																			clean.match(/^[}\])]/)
																				? Math.max(0, total.depth - 1)
																				: total.depth,
																		) +
																		line.trim(),
																}))(
																	line
																		.trim()
																		.replace(/"([^"\\]|\\.)*"/g, '""')
																		.replace(/'([^'\\]|\\.)*'/g, "''")
																		.replace(/`([^`\\]|\\.)*`/g, "``")
																		.replace(/\/\/.*$/g, "")
																		.replace(/\/\*[\s\S]*?\*\//g, ""),
																),
													{ depth: 0, text: "" },
												).text,
								],
								[child.props?.children, child.props.className],
							);

							return (
								<div style={{ tabSize: 2 }}>
									<DynamicCodeBlock lang={target} code={code} />
								</div>
							);
						},
					},
				});
			})(),
		);
	}

	return (
		<Suspense fallback={<p className="invisible">{text}</p>}>
			{use(cache.get(deferred)!)}
		</Suspense>
	);
}
