import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { page as find, paths } from "@/lib/sources";
import { release, versions } from "@/lib/versions";

// Hourly, as the releases a page's x.y.z gives are read.
export const revalidate = 3600;

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

	const [head, ...rest] = slug;
	const matchedVersion = head
		? versions.find((version) => version.slug === head)
		: undefined;

	const version = matchedVersion || versions.find((version) => !version.slug)!;
	const relSlug = matchedVersion ? rest : slug;

	const page = find(version, relSlug) ?? notFound();

	try {
		const text: string = await (page.data as any).getText("processed");
		return new NextResponse(text.replaceAll("x.y.z", await release(version)), {
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
	return versions.flatMap((version) =>
		paths(version).map((path) => ({
			slug: version.slug ? [version.slug, ...path] : path,
		})),
	);
}
