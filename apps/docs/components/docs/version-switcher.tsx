"use client";

import { usePathname } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import { SidebarProvider } from "fumadocs-ui/components/sidebar/base";
import type { SidebarTabWithProps } from "fumadocs-ui/components/sidebar/tabs/dropdown";
import { SidebarTabsDropdown } from "fumadocs-ui/components/sidebar/tabs/dropdown";

import type { Version } from "@/lib/versions";

export function VersionSwitcher({ versions }: { versions: Version[] }) {
	const pathname = usePathname() || "/docs";
	const [viewport, setViewport] = useState<"desktop" | "mobile">();

	useEffect(() => {
		const query = window.matchMedia("(min-width: 1024px)");
		const update = () => {
			setViewport(query.matches ? "desktop" : "mobile");
		};
		query.addEventListener("change", update);
		update();
		return () => {
			query.removeEventListener("change", update);
		};
	}, []);

	const active =
		versions.find(
			(version) =>
				version.slug &&
				(pathname === `/docs/${version.slug}` ||
					pathname.startsWith(`/docs/${version.slug}/`)),
		) || versions.find((version) => !version.slug)!;

	const options = useMemo<SidebarTabWithProps[]>(
		() =>
			versions.map((version) => {
				const path = active.slug
					? `/docs${pathname.slice(`/docs/${active.slug}`.length)}`
					: pathname;
				const url = version.slug
					? `/docs/${version.slug}${path.replace(/^\/docs/, "")}`
					: path;
				return {
					title: version.label,
					description: version.release || `${version.version} · in development`,
					url,
					urls: new Set([url]),
					props: {
						className: "px-2",
					},
				};
			}),
		[active, pathname, versions],
	);

	return (
		<div className="border-y border-foreground/5">
			<SidebarProvider key={viewport}>
				<SidebarTabsDropdown
					aria-label={`Documentation version: ${active.label}`}
					className="relative w-full rounded-none border-0 bg-transparent shadow-none [&_p:last-child]:block! px-4"
					options={options}
				/>
			</SidebarProvider>
		</div>
	);
}
