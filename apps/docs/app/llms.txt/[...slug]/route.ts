import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { docsVersions, resolveVersionFromSlug } from "@/lib/docs-versions";
import { getSourceFor } from "@/lib/source";

export const revalidate = false;

export async function GET(
	_: any,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	let slug = (await params).slug;

	if (slug[slug.length - 1]?.endsWith(".md")) {
		slug = [...slug.slice(0, -1), slug[slug.length - 1].replace(/\.md$/, "")];
	}

	if (slug[0] === "docs") {
		slug = slug.slice(1);
	}

	const data = resolveVersionFromSlug(slug);
	const page =
		getSourceFor(data.version.slug).getPage(data.relSlug) ?? notFound();

	try {
		return new NextResponse(await (page.data as any).getText("processed"), {
			status: 200,
			headers: { "Content-Type": "text/markdown" },
		});
	} catch (error) {
		console.error(error);
		return new NextResponse("# Error", {
			status: 500,
			headers: { "Content-Type": "text/markdown" },
		});
	}
}

export function generateStaticParams() {
	return docsVersions.flatMap((version) =>
		getSourceFor(version.slug)
			.generateParams()
			.map((param) => ({
				slug: version.slug
					? [version.slug, ...(param.slug ?? [])]
					: (param.slug ?? []),
			})),
	);
}
