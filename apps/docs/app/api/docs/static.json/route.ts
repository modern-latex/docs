import { findPath } from "fumadocs-core/page-tree";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
	const list = [];

	for (const page of source.getPages()) {
		const crumbs: string[] = [];
		const tree = source.getPageTree(page.locale);
		const path = findPath(
			tree.children,
			(node) => node.type === "page" && node.url === page.url,
		);

		if (path) {
			path.pop();
			if (typeof tree.name === "string" && tree.name.length > 0) {
				crumbs.push(tree.name);
			}
			for (const segment of path) {
				if (typeof segment.name === "string" && segment.name.length > 0) {
					crumbs.push(segment.name);
				}
			}
		}

		const data = await page.data.load();

		list.push({
			id: page.url,
			structured: data.structuredData,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
			breadcrumbs: crumbs,
		});
	}

	return Response.json(list);
}
