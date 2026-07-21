import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import React from "react";

import { Callout } from "@prostha/ui/src/components/callout";
import { cn } from "@prostha/ui/src/lib/utils";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { blogCollection } from "@/.source/server";
import { Panel } from "@/components/blog/panel";
import Footer from "@/components/landing/footer";
import { createMetadata } from "@/lib/metadata";

const blogs = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(blogCollection, []),
});

export default async function Page({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}) {
	const parsed = await params;

	if (!parsed.slug) {
		return (
			<div className="flex flex-col lg:flex-row h-full min-h-dvh pt-14 lg:pt-0">
				<Panel
					count={blogs.getPages().filter((item) => !item.data.draft).length}
				/>

				<div className="w-full lg:w-[70%] flex flex-col">
					<div className="px-5 pt-5 lg:p-8 lg:pt-20">
						<h2 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-neutral-900 dark:text-neutral-100">
							BLOGS
							<span className="flex-1 h-px bg-foreground/15" />
						</h2>
					</div>

					<div className="flex flex-col">
						{blogs
							.getPages()
							.filter((item) => !item.data.draft)
							.sort(
								(first, second) =>
									new Date(second.data.date).getTime() -
									new Date(first.data.date).getTime(),
							)
							.map((post) => (
								<Link
									key={post.slugs.join("/")}
									href={`/blog/${post.slugs.join("/")}`}
									className="group block border-b border-dashed border-foreground/6 px-5 sm:px-6 lg:px-8 py-5 transition-colors hover:bg-foreground/2"
								>
									<div className="flex gap-5 items-center">
										{post.data?.image && (
											<div className="shrink-0 w-56 aspect-1200/630 overflow-hidden border border-foreground/6 hidden sm:block">
												<Image
													src={post.data.image}
													alt={post.data.title}
													width={320}
													height={192}
													className="w-full h-full object-cover"
												/>
											</div>
										)}
										<div className="flex-1 min-w-0">
											<h2 className="text-lg font-medium tracking-tight text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
												{post.data.title}
											</h2>
											{post.data.description && (
												<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-4xl">
													{post.data.description}
												</p>
											)}
											<div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
												{post.data.author?.name && (
													<>
														<span className="text-neutral-500 dark:text-neutral-400">
															{post.data.author.name}
														</span>
														<span>&middot;</span>
													</>
												)}
												<span>
													{new Date(post.data.date).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
												</span>
											</div>
											{post.data.tags && post.data.tags.length > 0 && (
												<div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
													{post.data.tags.slice(0, 3).map((tag: string) => (
														<span key={tag}>#{tag}</span>
													))}
												</div>
											)}
										</div>
										<span className="shrink-0 text-[11px] font-mono text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors self-center">
											&rarr;
										</span>
									</div>
								</Link>
							))}
					</div>
					<Footer />
				</div>
			</div>
		);
	}

	const page = blogs.getPage(parsed.slug);
	if (!page || page.data.draft) return notFound();

	return (
		<div className="flex flex-col lg:flex-row h-full min-h-dvh pt-14 lg:pt-0">
			<Panel
				post={{
					title: page.data.title,
					description: page.data.description,
					date: page.data.date,
					author: page.data.author,
					toc: page.data.toc ?? [],
				}}
			/>

			<div className="w-full lg:w-[70%] flex flex-col">
				<div className="relative px-5 sm:px-6 lg:px-8 pb-24 pt-8 lg:py-24">
					<article className="prose prose-neutral dark:prose-invert max-w-3xl prose-headings:tracking-tight prose-a:decoration-dashed prose-a:underline-offset-4 prose-pre:rounded-none prose-pre:border prose-pre:border-foreground/10 prose-img:rounded-none [&_[data-header-label]+h2]:mt-2 [&_[data-header-label]+h3]:mt-2 [&_[data-header-label]+h4]:mt-1">
						{React.createElement(page.data.body, {
							components: {
								...defaultMdxComponents,
								Step,
								Steps,
								Tab,
								Tabs,
								Accordion,
								Accordions,
								Callout: ({
									children,
									type,
									...props
								}: {
									children: React.ReactNode;
									type?:
										| "info"
										| "warn"
										| "error"
										| "success"
										| "warning"
										| "none";
								}) => (
									<Callout type={type === "none" ? undefined : type} {...props}>
										{children}
									</Callout>
								),
								Contributors: ({ usernames }: { usernames: string[] }) => (
									<div className="flex flex-wrap gap-1.5 not-prose">
										{usernames.map((username) => (
											<a
												key={username}
												href={`https://github.com/${username}`}
												target="_blank"
												rel="noreferrer noopener"
												className="text-xs font-mono px-2 py-1 border border-foreground/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:border-foreground/20 transition-colors"
											>
												@{username}
											</a>
										))}
									</div>
								),
								a: ({ className, href, children, ...props }: any) => (
									<a
										className={cn(
											"font-medium underline decoration-dashed underline-offset-4",
											className,
										)}
										href={href}
										{...(typeof href === "string" &&
										/^(https?:)?\/\//.test(href)
											? { target: "_blank", rel: "noreferrer noopener" }
											: {})}
										{...props}
									>
										{children}
									</a>
								),
							},
						})}
					</article>
				</div>
				<Footer />
			</div>
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
	const parsed = await params;
	if (!parsed.slug) {
		return createMetadata({
			title: "Blog - Prostha",
			description: "Latest updates, articles, and insights about Prostha",
		});
	}
	const page = blogs.getPage(parsed.slug);
	if (!page || page.data.draft) return notFound();

	return createMetadata({
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			title: page.data.title,
			description: page.data.description,
			type: "article",
			images: [
				page.data.image ||
					`/api/og-release?${new URLSearchParams({
						heading: page.data.title,
						description: page.data.description || "",
						date: page.data.date
							? new Date(page.data.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})
							: "",
					}).toString()}`,
			],
		},
		twitter: {
			card: "summary_large_image" as const,
			title: page.data.title,
			description: page.data.description,
			images: [
				page.data.image ||
					`/api/og-release?${new URLSearchParams({
						heading: page.data.title,
						description: page.data.description || "",
						date: page.data.date
							? new Date(page.data.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})
							: "",
					}).toString()}`,
			],
		},
	});
}

export function generateStaticParams() {
	return blogs
		.getPages()
		.filter((item) => !item.data.draft)
		.map((item) => ({ slug: item.slugs }));
}
