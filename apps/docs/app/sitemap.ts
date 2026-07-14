import type { MetadataRoute } from "next";
import { blogs, source } from "@/lib/source";

const url = process.env.NEXT_PUBLIC_APP_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let pages: MetadataRoute.Sitemap = [
		{
			url: url,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${url}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${url}/changelog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${url}/community`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];

	pages = pages.concat(
		await Promise.all(
			source.getPages().map(async (page) => {
				const { lastModified } = await page.data.load();
				return {
					url: `${url}${page.url}`,
					lastModified: lastModified ? new Date(lastModified) : new Date(),
					changeFrequency: "weekly" as const,
					priority: 0.7,
				};
			}),
		),
	);

	pages = pages.concat(
		blogs.getPages().map((page) => ({
			url: `${url}${page.url.replace("/blogs/", "/blog/")}`,
			lastModified: page.data.date ? new Date(page.data.date) : new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	);

	return pages;
}
