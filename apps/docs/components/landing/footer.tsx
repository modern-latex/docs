"use client";

import { icons } from "@prostha/ui/src/icons";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

export default function Footer() {
	return (
		<footer className="relative mt-10 py-6 px-5 sm:px-6 lg:px-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
					{[
						{ label: "Terms", href: "/legal/terms" },
						{ label: "Privacy", href: "/legal/privacy" },
						{ label: "Blog", href: "/blog" },
						{ label: "Community", href: "/community" },
						{ label: "Changelog", href: "/changelog" },
					].map((element, index, array) => (
						<span key={element.label} className="flex items-center">
							<Link
								href={element.href}
								className="group inline-flex items-center gap-1 text-[11px] font-mono text-foreground/50 hover:text-foreground/80 transition-colors"
							>
								{element.label}
							</Link>
							{index < array.length - 1 && (
								<span className="text-foreground/10 mx-1 text-[10px] select-none">
									/
								</span>
							)}
						</span>
					))}
				</div>

				<div className="flex items-center justify-between w-full sm:w-auto sm:gap-4 shrink-0">
					<span className="text-[10px] text-foreground/50 font-mono">
						© {new Date().getFullYear()} Prostha Inc.
					</span>
					<div className="flex items-center gap-3 sm:gap-4">
						<span className="text-foreground/10 select-none hidden sm:inline">
							·
						</span>
						<Link
							href="https://x.com/prostha"
							aria-label="Twitter/X"
							className="text-foreground/50 hover:text-foreground/80 transition-colors"
						>
							<icons.x className="h-3.5 w-3.5" />
						</Link>
						<Link
							href="https://github.com/prostha"
							aria-label="GitHub"
							className="text-foreground/50 hover:text-foreground/80 transition-colors"
						>
							<icons.github className="h-3.5 w-3.5" />
						</Link>
						<div className="h-4 w-4 flex text-foreground/15 items-center justify-center select-none">
							|
						</div>
						<div className="-ml-4 sm:-ml-5">
							<ThemeProvider />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
