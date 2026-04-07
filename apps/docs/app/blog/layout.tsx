import React from "react";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { RootProvider } from "fumadocs-ui/provider/next";

export const metadata: Metadata = createMetadata({
	title: "Blog",
	description: "Latest updates, articles, and insights about Better Auth",
	openGraph: {
		url: "/blog",
		title: "Blog - Better Auth",
		description: "Latest updates, articles, and insights about Better Auth",
		images: ["/api/og-release?heading=Better%20Auth%20Blog"],
	},
	twitter: {
		images: ["/api/og-release?heading=Better%20Auth%20Blog"],
		title: "Blog - Better Auth",
		description: "Latest updates, articles, and insights about Better Auth",
	},
	alternates: {
		types: {
			"application/rss+xml": [
				{
					title: "Better Auth Blog",
					url: "https://better-auth.com/blog/rss.xml",
				},
			],
		},
	},
});

export default function Layout({children}: {
	children: React.ReactNode;
}) {
	return (
		<RootProvider>
			<div className="relative flex min-h-screen flex-col">
				<main className="flex-1">{children}</main>
			</div>
		</RootProvider>
	);
}