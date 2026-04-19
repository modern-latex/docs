"use client";

import type {
	SearchItemType,
	SharedProps,
} from "fumadocs-ui/components/dialog/search";
import {
	SearchDialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogFooter,
	SearchDialogHeader,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogListItem,
	SearchDialogOverlay,
} from "fumadocs-ui/components/dialog/search";
import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, use } from "react";
import { Client } from "typesense";
import { useTypesenseSearch } from "typesense-fumadocs-adapter/client";
import { Context } from "@/app/docs/provider";

const client = (() => {
	const url = process.env.NEXT_PUBLIC_TYPESENSE_SERVER_URL;
	const key = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;
	if (!url || !key) {
		return new Client({
			nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
			apiKey: "dummy",
		});
	}
	let uri: URL;
	try {
		uri = new URL(url);
	} catch {
		return new Client({
			nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
			apiKey: "dummy",
		});
	}
	return new Client({
		nodes: [
			{
				host: uri.hostname,
				port:
					Number(uri.port) ||
					(uri.protocol === "https:" ? 443 : 80),
				protocol: uri.protocol.replace(":", ""),
			},
		],
		apiKey: key,
	});
})();

export default function CustomSearchDialog(props: SharedProps) {
	const { search, setSearch, query } = useTypesenseSearch({
		typesenseCollectionName: "better-auth-docs",
		client: client!,
		legacy: true,
	});

	const entries = use(Context);
	const router = useRouter();

	const page = useMemo<SearchItemType | undefined>(() => {
		if (search.length === 0) return;

		const match = search.toLowerCase();
		for (const entry of entries) {
			if (!entry.name.toLowerCase().includes(match)) continue;

			return {
				id: "quick-action",
				type: "action",
				node: (
					<div className="inline-flex items-center gap-2 text-fd-muted-foreground">
						<ArrowRight className="size-4" />
						<p>
							Jump to{" "}
							<span className="font-medium text-fd-foreground">
                         {entry.name}
                      </span>
						</p>
					</div>
				),
				onSelect: () => router.push(entry.url),
			};
		}
	}, [router, search, entries]);

	const ai = useMemo<SearchItemType | undefined>(() => {
		if (!search.trim()) return;

		return {
			id: "ask-ai-action",
			type: "action",
			node: (
				<div className="inline-flex items-center gap-2 text-fd-muted-foreground">
					<ArrowRight className="size-4 text-purple-500" />
					<p>
						Ask AI:{" "}
						<span className="font-medium text-fd-foreground">
                      "{search}"
                   </span>
					</p>
				</div>
			),
			onSelect: () => {
				const next = new URLSearchParams(window.location.search);
				next.set("askai", search);
				const path = next.toString()
					? `${window.location.pathname}?${next.toString()}`
					: window.location.pathname;

				window.history.replaceState({}, "", path);
				window.dispatchEvent(new CustomEvent("better-auth:open-ai-chat"));
			},
		};
	}, [search]);

	return (
		<SearchDialog
			search={search}
			onSearchChange={setSearch}
			isLoading={query.isLoading}
			{...props}
		>
			<SearchDialogOverlay className="z-200" />
			<SearchDialogContent className="z-200">
				<SearchDialogHeader>
					<Search
						className={
							query.isLoading
								? "size-5 animate-pulse text-foreground duration-400"
								: "size-5 text-fd-muted-foreground"
						}
					/>
					<SearchDialogInput />
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList
					items={
						query.data !== "empty" || page || ai
							? [
								...(page ? [page] : []),
								...(ai ? [ai] : []),
								...(Array.isArray(query.data) ? query.data : []),
							]
							: null
					}
					Item={({ item, onClick }) => (
						<SearchDialogListItem
							item={item}
							onClick={onClick}
							className={
								item.type !== "action"
									? "max-h-24 [&>div:last-child]:line-clamp-2"
									: undefined
							}
						/>
					)}
				/>
				<SearchDialogFooter>
                <span className="text-xs text-fd-muted-foreground">
                   Search powered by{" "}
					<a
						href="https://typesense.org"
						target="_blank"
						rel="noreferrer noopener"
						className="underline hover:text-fd-foreground transition-colors"
					>
                      Typesense
                   </a>
                </span>
				</SearchDialogFooter>
			</SearchDialogContent>
		</SearchDialog>
	);
}