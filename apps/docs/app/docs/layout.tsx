import type { ReactNode } from "react";
import { Suspense } from "react";

import { loader } from "fumadocs-core/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { docs } from "@/.source/server";
import type { Entry } from "@/app/docs/provider";
import { DocsProvider } from "@/app/docs/provider";
import { Chat, Panel, Trigger } from "@/components/chat";
import { Sidebar } from "@/components/docs/sidebar";

const source = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});

const entries: Entry[] = source.getPages().map((page) => ({
	name: page.data.title,
	url: page.url,
}));

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsProvider entries={entries}>
			<Chat>
				<Suspense>
					<Sidebar />
				</Suspense>
				<DocsLayout
					tree={source.pageTree}
					nav={{ enabled: false }}
					searchToggle={{ enabled: false }}
					themeSwitch={{ enabled: false }}
					sidebar={{ enabled: false }}
					containerProps={{
						className: "docs-layout",
					}}
				>
					{children}
					<Panel />
					<Trigger>
						<span className="text-sm text-muted-foreground">Ask AI</span>
						<span className="h-5 w-px bg-foreground/10" />
						<kbd className="inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground">
							<span className="text-[11px]">&#8984;</span>I
						</kbd>
					</Trigger>
				</DocsLayout>
			</Chat>
		</DocsProvider>
	);
}
