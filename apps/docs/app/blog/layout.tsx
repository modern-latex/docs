import type { Metadata } from "next";

import type React from "react";

import { RootProvider } from "fumadocs-ui/provider/next";

import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Blog",
	description: "Latest updates, articles, and insights.",
	openGraph: {
		url: "/blog",
		title: "Blog - Prostha",
		description: "Latest updates, articles, and insights.",
		images: ["/api/og-release?heading=Prostha%20Blog"],
	},
	twitter: {
		images: ["/api/og-release?heading=Prostha%20Blog"],
		title: "Blog - Prostha",
		description: "Latest updates, articles, and insights.",
	},
	alternates: {
		types: {
			"application/rss+xml": [
				{
					title: "Prostha Blog",
					url: "https://prostha.org/blog/rss.xml",
				},
			],
		},
	},
});

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<RootProvider>
			<div className="relative flex min-h-screen flex-col">
				<main className="flex-1">{children}</main>
			</div>
		</RootProvider>
	);
}
