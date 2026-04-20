import { Callout } from "@prostha/ui/src/components/callout";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/page";
import { MilestoneIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { createElement } from "react";
import { Llms, Options } from "@/app/docs//[[...slug]]/page.client";
import { Api } from "@/components/api";
import {
	docsVersions,
	resolveVersionFromSlug,
	scopeDocsHref,
} from "@/lib/docs-versions";
import { createMetadata } from "@/lib/metadata";
import { getSourceFor } from "@/lib/source";
import { cn } from "@/lib/utils";

export default async function Page({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}) {
	const resolved = resolveVersionFromSlug((await params).slug ?? []);
	const page = getSourceFor(resolved.version.slug).getPage(resolved.relSlug);

	if (!page) return notFound();

	return (
		<DocsPage
			toc={(await page.data.load()).toc}
			full={false}
			tableOfContent={{
				style: "clerk",
			}}
			breadcrumb={{ enabled: false }}
			editOnGithub={{
				owner: "better-auth",
				repo: "better-auth",
				sha: resolved.version.branch,
				path: `docs/content/docs/${page.path}`,
			}}
		>
			{resolved.version.slug === "beta" && (
				<div className="mb-2 flex items-center gap-3 py-2.5 text-sm text-blue-600 dark:text-blue-400 text-pretty">
					<MilestoneIcon size={18} className="shrink-0" fill="currentColor" />
					<p>
						You are currently viewing documentation for{" "}
						<span className="bg-blue-600/10 dark:bg-blue-400/15 px-1 py-0.5 rounded-lg font-medium tracking-wider">
							{resolved.version.label}
						</span>
					</p>
				</div>
			)}
			<div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<DocsTitle className="mb-0">{page.data.title}</DocsTitle>
					{page.data.description && (
						<DocsDescription className="mt-2 mb-0">
							{page.data.description}
						</DocsDescription>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2 not-prose lg:shrink-0">
					<Llms
						url={`https://raw.githubusercontent.com/prostha/${resolved.version.branch}/docs/content/docs/${page.path}`}
					/>
					<Options
						url={`${page.url}.mdx`}
						github={`https://github.com/prostha/blob/${resolved.version.branch}/docs/content/docs/${page.path}`}
						markdown={`/llms.txt${page.url}.md`}
					/>
				</div>
			</div>
			<DocsBody>
				{createElement((await page.data.load()).body, {
					components: {
						...defaultMdxComponents,
						Step,
						Steps,
						Tab,
						Tabs,
						Accordion,
						Accordions,
						APIMethod: Api,
						Callout: ({
							children,
							type,
							...props
						}: {
							children: React.ReactNode;
							type?: "info" | "warn" | "error" | "success" | "warning";
						}) => (
							<Callout type={type} {...props}>
								{children}
							</Callout>
						),
						a: (props: React.ComponentProps<"a">) => (
							<defaultMdxComponents.a
								{...props}
								href={scopeDocsHref(props.href, resolved.version)}
							/>
						),
						Link: ({
							href,
							className,
							...props
						}: React.ComponentProps<typeof Link>) => (
							<Link
								href={
									typeof href === "string"
										? (scopeDocsHref(href, resolved.version) ?? href)
										: href
								}
								className={cn(
									"font-medium underline underline-offset-4",
									className,
								)}
								{...props}
							/>
						),
					},
				})}
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return docsVersions.flatMap((version) =>
		getSourceFor(version.slug)
			.generateParams()
			.map((param) => ({
				slug: version.slug ? [version.slug, ...(param.slug ?? [])] : param.slug,
			})),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
	const resolved = resolveVersionFromSlug((await params).slug ?? []);
	const page = getSourceFor(resolved.version.slug).getPage(resolved.relSlug);

	if (!page) return notFound();

	return createMetadata({
		title: resolved.version.slug
			? `${resolved.version.label} - ${page.data.title}`
			: page.data.title,
		description: page.data.description,
		openGraph: {
			title: resolved.version.slug
				? `${resolved.version.label} - ${page.data.title}`
				: page.data.title,
			description: page.data.description,
			type: "article",
			images: [
				{
					url: `/api/og?${new URLSearchParams({
						heading: resolved.version.slug
							? `${resolved.version.label} - ${page.data.title}`
							: page.data.title,
						type: "documentation",
						mode: "dark",
					}).toString()}`,
					width: 1200,
					height: 630,
					alt: resolved.version.slug
						? `${resolved.version.label} - ${page.data.title}`
						: page.data.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: resolved.version.slug
				? `${resolved.version.label} - ${page.data.title}`
				: page.data.title,
			description: page.data.description,
			images: [
				`/api/og?${new URLSearchParams({
					heading: resolved.version.slug
						? `${resolved.version.label} - ${page.data.title}`
						: page.data.title,
					type: "documentation",
					mode: "dark",
				}).toString()}`,
			],
		},
	});
}
