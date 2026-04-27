import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type React from "react";
import { createElement } from "react";

import { Callout } from "@prostha/ui/src/components/callout";
import { cn } from "@prostha/ui/src/lib/utils";
import { loader } from "fumadocs-core/source";
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

import { docs, docsBeta } from "@/.source/server";
import { Llms, Options } from "@/app/docs//[[...slug]]/page.client";
import { Api } from "@/components/api";
import { createMetadata } from "@/lib/metadata";
import { versions } from "@/lib/versions";

const primary = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});

const secondary = loader({
	baseUrl: "/docs/beta",
	source: docsBeta.toFumadocsSource(),
});

export default async function Page({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}) {
	const payload = await params;
	const slugs = payload.slug ?? [];
	const head = slugs[0];
	const rest = slugs.slice(1);
	const matched = head ? versions.find((v) => v.slug === head) : undefined;
	const latest = versions.find((v) => v.slug === null)!;
	const version = matched ? matched : latest;
	const relative = matched ? rest : slugs;
	const source = version.slug === "secondary" ? secondary : primary;
	const page = source.getPage(relative);

	if (!page) return notFound();

	const loaded = await page.data.load();
	const body = loaded.body;
	const toc = loaded.toc;

	return (
		<DocsPage
			toc={toc}
			full={false}
			tableOfContent={{
				style: "clerk",
			}}
			breadcrumb={{ enabled: false }}
			editOnGithub={{
				owner: "prostha",
				repo: "runtime",
				sha: version.branch,
				path: `docs/content/docs/${page.path}`,
			}}
		>
			{version.slug === "secondary" && (
				<div className="mb-2 flex items-center gap-3 py-2.5 text-sm text-blue-600 dark:text-blue-400 text-pretty">
					<MilestoneIcon size={18} className="shrink-0" fill="currentColor" />
					<p>
						You are currently viewing documentation for{" "}
						<span className="bg-blue-600/10 dark:bg-blue-400/15 px-1 py-0.5 rounded-lg font-medium tracking-wider">
							{version.label}
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
						url={`https://raw.githubusercontent.com/prostha/${version.branch}/docs/content/docs/${page.path}`}
					/>
					<Options
						url={`${page.url}.mdx`}
						github={`https://github.com/prostha/blob/${version.branch}/docs/content/docs/${page.path}`}
						markdown={`/llms.txt${page.url}.md`}
					/>
				</div>
			</div>
			<DocsBody>
				{createElement(body, {
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
							children: content,
							type: kind,
							...properties
						}: {
							children: React.ReactNode;
							type?: "info" | "warn" | "error" | "success" | "warning";
						}) => (
							<Callout type={kind} {...properties}>
								{content}
							</Callout>
						),
						a: (properties: React.ComponentProps<"a">) => {
							let hyperlink = properties.href;
							if (hyperlink) {
								if (version.slug) {
									const test = /^\/docs(?:\/|$|[?#])/.test(hyperlink);
									if (test) {
										const path = hyperlink.split(/[?#]/, 1)[0];
										const segment = path.split("/")[2];
										const matches = versions.some((v) => v.slug === segment);
										if (!matches) {
											const stripped = hyperlink.replace(/^\/docs/, "");
											hyperlink = `/docs/${version.slug}${stripped}`;
										}
									}
								}
							}
							return (
								<defaultMdxComponents.a {...properties} href={hyperlink} />
							);
						},
						Link: ({
							href: destination,
							className: style,
							...properties
						}: React.ComponentProps<typeof Link>) => {
							let target = destination;
							if (typeof target === "string") {
								if (version.slug) {
									const test = /^\/docs(?:\/|$|[?#])/.test(target);
									if (test) {
										const path = target.split(/[?#]/, 1)[0];
										const segment = path.split("/")[2];
										const matches = versions.some((v) => v.slug === segment);
										if (!matches) {
											const stripped = target.replace(/^\/docs/, "");
											target = `/docs/${version.slug}${stripped}`;
										}
									}
								}
							}
							return (
								<Link
									href={target}
									className={cn(
										"font-medium underline underline-offset-4",
										style,
									)}
									{...properties}
								/>
							);
						},
					},
				})}
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return versions.flatMap((version) => {
		const source = version.slug === "secondary" ? secondary : primary;
		const parameters = source.generateParams();
		return parameters.map((parameter) => {
			const dynamic = parameter.slug ?? [];
			const slugs = version.slug ? [version.slug, ...dynamic] : dynamic;
			return {
				slug: slugs,
			};
		});
	});
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
	const payload = await params;
	const slugs = payload.slug ?? [];
	const head = slugs[0];
	const rest = slugs.slice(1);
	const matched = head ? versions.find((v) => v.slug === head) : undefined;
	const latest = versions.find((v) => v.slug === null)!;
	const version = matched ? matched : latest;
	const relative = matched ? rest : slugs;
	const source = version.slug === "secondary" ? secondary : primary;
	const page = source.getPage(relative);

	if (!page) return notFound();

	const title = version.slug
		? `${version.label} - ${page.data.title}`
		: page.data.title;

	const description = page.data.description;

	const query = new URLSearchParams({
		heading: title,
		type: "documentation",
		mode: "dark",
	}).toString();

	const image = `/api/og?${query}`;

	return createMetadata({
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
		},
	});
}
