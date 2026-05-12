"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";

import { cn } from "@prostha/ui/src/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import type { Version } from "@/lib/versions";

export function VersionSwitcher({ versions }: { versions: Version[] }) {
	const pathname = usePathname() || "/docs";
	const [open, setOpen] = useState(false);

	const active =
		versions.find(
			(version) =>
				version.slug &&
				(pathname === `/docs/${version.slug}` ||
					pathname.startsWith(`/docs/${version.slug}/`)),
		) || versions.find((version) => !version.slug)!;
	const path = active.slug
		? `/docs${pathname.slice(`/docs/${active.slug}`.length)}`
		: pathname;

	return (
		<div className="border-y border-foreground/5">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger
					aria-label={`Documentation version: ${active.label}`}
					className="flex w-full items-center gap-2 p-2 px-4 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground"
				>
					<div>
						<p className="flex items-center gap-2 text-sm font-medium">
							{active.label}
							{active.badge && (
								<span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-dashed border-foreground/20 text-foreground/45">
									{active.badge}
								</span>
							)}
						</p>
						<p className="text-sm text-fd-muted-foreground empty:hidden">
							{active.release}
						</p>
					</div>
					<ChevronsUpDown className="shrink-0 ms-auto size-4 text-fd-muted-foreground" />
				</PopoverTrigger>
				<PopoverContent className="flex flex-col gap-1 w-(--radix-popover-trigger-width) p-1 fd-scroll-container">
					{versions.map((version) => (
						<Link
							key={version.label}
							href={
								version.slug
									? `/docs/${version.slug}${path.replace(/^\/docs/, "")}`
									: path
							}
							onClick={() => setOpen(false)}
							className="flex items-center gap-2 rounded-lg p-1.5 px-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
						>
							<div>
								<p className="flex items-center gap-2 text-sm font-medium leading-none">
									{version.label}
									{version.badge && (
										<span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-dashed border-foreground/20 text-foreground/45">
											{version.badge}
										</span>
									)}
								</p>
								<p className="text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden">
									{version.release}
								</p>
							</div>
							<Check
								className={cn(
									"shrink-0 ms-auto size-3.5 text-fd-primary",
									version !== active && "invisible",
								)}
							/>
						</Link>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
}
