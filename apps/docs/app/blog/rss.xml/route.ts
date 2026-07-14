import { Feed } from "feed";
import { url } from "@/lib/metadata";
import { blogs } from "@/lib/source";

export const revalidate = false;

export function GET() {
	const feed = new Feed({
		title: "Prostha Blog",
		description: "Latest updates, articles, and insights about Prostha",
		generator: "prostha",
		id: `${url}blog`,
		link: `${url}blog`,
		language: "en",
		image: `${url}release-og/blogs.png`,
		favicon: `${url}favicon/favicon-32x32.png`,
		copyright: `Copyright © ${new Date().getFullYear()} Prostha Inc.`,
	});

	for (const page of blogs.getPages().sort((first, second) => {
		return (
			new Date(second.data.date).getTime() - new Date(first.data.date).getTime()
		);
	})) {
		feed.addItem({
			id: page.url,
			title: page.data.title,
			description: page.data.description,
			image: page.data.image
				? page.data.image.startsWith("/")
					? `${page.url.replace("blogs/", "blog/")}${page.data.image.slice(1)}`
					: page.data.image
				: undefined,
			link: page.url.replace("blogs/", "blog/").startsWith("/")
				? `${page.url.replace("blogs/", "blog/")}${page.url.replace("blogs/", "blog/").slice(1)}`
				: page.url.replace("blogs/", "blog/"),
			date: new Date(page.data.date),
			author: page.data.author
				? [
						{
							name: page.data.author.name,
							avatar: page.data.author.avatar,
							link: page.data.author.twitter,
						},
					]
				: [],
		});
	}

	return new Response(feed.rss2(), {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
		},
	});
}
