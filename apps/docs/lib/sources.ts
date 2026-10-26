import { loader } from "fumadocs-core/source";

import { doc, docsArchive, docsBeta } from "@/.source/server";
import type { Version } from "@/lib/versions";
import { archived } from "@/lib/versions";

const latest = loader({
	baseUrl: "/docs",
	source: doc.toFumadocsSource(),
});

const beta = loader({
	baseUrl: "/docs/beta",
	source: docsBeta.toFumadocsSource(),
});

// Each earlier version is a folder named for its number, so its pages are
// served under /docs/0.1 straight from the folder's path.
const archive = loader({
	baseUrl: "/docs",
	source: docsArchive.toFumadocsSource(),
});

/** A version's page at a path relative to the version, such as ["faq"]. */
export function page(version: Version, path: string[]) {
	if (archived(version)) return archive.getPage([version.slug!, ...path]);
	return (version.slug ? beta : latest).getPage(path);
}

/** Every page path of a version, relative to it. */
export function paths(version: Version): string[][] {
	if (archived(version)) {
		return archive
			.generateParams()
			.map((parameter) => parameter.slug ?? [])
			.filter((path) => path[0] === version.slug)
			.map((path) => path.slice(1));
	}
	return (version.slug ? beta : latest)
		.generateParams()
		.map((parameter) => parameter.slug ?? []);
}

/** A page's file within its version's content/docs folder. */
export function file(version: Version, path: string): string {
	return archived(version) ? path.slice(version.slug!.length + 1) : path;
}
