import { createFromSource } from "fumadocs-core/search/server";
import { loader } from "fumadocs-core/source";

import { doc } from "@/.source/server";

// The docs' own search, which the search dialog asks when no Typesense server
// is set. Each page is kept by its file, since two files can share a URL, as
// revtex4-1 and revtex4.1 do.
export const { GET } = createFromSource(
	loader({
		baseUrl: "/docs",
		source: doc.toFumadocsSource(),
	}),
	{
		buildIndex: async (page) => ({
			id: page.path,
			url: page.url,
			title: page.data.title ?? page.path,
			description: page.data.description,
			structuredData: (await page.data.load()).structuredData,
		}),
	},
);
