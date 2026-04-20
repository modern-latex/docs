import { NextResponse } from "next/server";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	const pages = source.getPages();

	const groups = pages.reduce(
		(collection, page) => {
			const root = page.slugs[0];
			if (root === "openapi") return collection;

			const category = root || "general";

			if (!collection[category]) collection[category] = [];
			collection[category].push({
				title: page.data.title,
				description: page.data.description ? `: ${page.data.description}` : "",
				url: `/llms.txt${page.url}.md`,
			});

			return collection;
		},
		{} as Record<
			string,
			Array<{ title: string; description: string; url: string }>
		>,
	);

	let content = `# Prosthaphaeresis\n\n> LLM-optimized documentation and resources\n\n## Table of Contents\n\n`;

	Object.keys(groups)
		.sort()
		.forEach((key) => {
			const title = key
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			content += `### ${title}\n\n`;

			groups[key].forEach((page) => {
				content += `- [${page.title}](${page.url})${page.description}\n`;
			});

			content += "\n";
		});

	return new NextResponse(content.trim() + "\n", {
		headers: {
			"Content-Type": "text/markdown",
		},
	});
}
