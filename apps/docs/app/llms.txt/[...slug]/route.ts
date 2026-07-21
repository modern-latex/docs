import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { loader } from "fumadocs-core/source";

import { docs, docsBeta } from "@/.source/server";
import { versions } from "@/lib/versions";

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

	const [head, ...rest] = slug;
	const matchedVersion = head
		? versions.find((version) => version.slug === head)
		: undefined;

	const version = matchedVersion || versions[1];
	const relSlug = matchedVersion ? rest : slug;

	const docSource =
		version.slug === "beta"
			? loader({ baseUrl: "/docs/beta", source: docsBeta.toFumadocsSource() })
			: loader({ baseUrl: "/docs", source: docs.toFumadocsSource() });

	const page = docSource.getPage(relSlug) ?? notFound();

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
	return versions.flatMap((version) => {
		const docSource =
			version.slug === "beta"
				? loader({ baseUrl: "/docs/beta", source: docsBeta.toFumadocsSource() })
				: loader({ baseUrl: "/docs", source: docs.toFumadocsSource() });

		return docSource.generateParams().map((param) => ({
			slug: version.slug
				? [version.slug, ...(param.slug ?? [])]
				: (param.slug ?? []),
		}));
	});
}
