"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	docsVersions,
	getVersionFromPathname,
	stripVersionPrefix,
	versionedDocsHref,
} from "@/lib/docs-versions";

export function VersionSwitcher() {
	const pathname = usePathname() || "/docs";
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const reference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (event: MouseEvent) => {
			if (
				reference.current &&
				!reference.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		if (open) {
			document.addEventListener("mousedown", handler);
		}
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	return (
		<div ref={reference} className="relative border-y border-foreground/5">
			<button
				type="button"
				onClick={() => setOpen((version) => !version)}
				className="group/version flex w-full items-center gap-2 px-4 py-2.25 text-sm text-foreground/55 hover:text-foreground/80 hover:bg-foreground/3 transition-colors"
			>
				<svg
					className="size-4 shrink-0 text-foreground opacity-55 group-hover/version:opacity-80 transition-opacity"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M7 8.25a2.75 2.75 0 1 0 0-5.5a2.75 2.75 0 0 0 0 5.5m0 0V12m0 3.75a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5m0 0V12m10-3.75a2.75 2.75 0 1 0 0-5.5a2.75 2.75 0 0 0 0 5.5m0 0V9a3 3 0 0 1-3 3H7" />
				</svg>
				<span className="truncate">
					{getVersionFromPathname(pathname).label}
				</span>
				{getVersionFromPathname(pathname).badge && (
					<span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-dashed border-foreground/20 text-foreground/45">
						{getVersionFromPathname(pathname).badge}
					</span>
				)}
				<svg
					className="ml-auto size-4 shrink-0 text-foreground/40"
					viewBox="0 0 16 16"
					fill="none"
				>
					<path
						d="M5 6.5L8 3.5L11 6.5"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5 9.5L8 12.5L11 9.5"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.12, ease: "easeOut" }}
						className="absolute left-0 right-0 top-full z-50 border-b border-foreground/8 bg-background shadow-lg shadow-black/10 dark:shadow-black/40 py-1"
					>
						{docsVersions.map((version) => {
							return (
								<button
									key={version.version}
									type="button"
									onClick={() => {
										setOpen(false);
										if (version.slug === getVersionFromPathname(pathname).slug)
											return;
										router.push(
											versionedDocsHref(
												stripVersionPrefix(
													pathname,
													getVersionFromPathname(pathname),
												),
												version,
											),
										);
									}}
									className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 ${
										version.slug === getVersionFromPathname(pathname).slug
											? "text-foreground bg-foreground/5"
											: "text-foreground/55 hover:text-foreground/80 hover:bg-foreground/3"
									}`}
								>
									<span className="size-4 shrink-0 flex items-center justify-center">
										{version.slug === getVersionFromPathname(pathname).slug && (
											<Check className="size-3.5 text-foreground/70" />
										)}
									</span>
									<span className="truncate">{version.label}</span>
									{version.badge && (
										<span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-dashed border-foreground/20 text-foreground/45">
											{version.badge}
										</span>
									)}
								</button>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
