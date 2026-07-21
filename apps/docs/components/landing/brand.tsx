"use client";

import Link from "next/link";

import type React from "react";
import { useEffect, useState } from "react";

import { Popover } from "@prostha/ui/src/components/popover";
import { Code, Download, Palette, Type } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { assets } from "@/lib/brand";

interface Props {
	logo: React.ReactNode;
}

export default function Brand({ logo }: Props) {
	const [open, setOpen] = useState(false);
	const { resolvedTheme: theme } = useTheme();
	const variant = theme === "dark" ? "light" : "dark";

	useEffect(() => {
		const query = window.matchMedia("(min-width: 1024px)");
		const change = () => {
			if (!query.matches) setOpen(false);
		};
		query.addEventListener("change", change);
		return () => query.removeEventListener("change", change);
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Popover.Anchor asChild>
				<div
					onContextMenu={(event) => {
						event.preventDefault();
						setOpen(true);
					}}
					className="cursor-pointer"
				>
					{logo}
				</div>
			</Popover.Anchor>
			<Popover.Content align="start" sideOffset={8} className="w-56 p-1">
				<button
					type="button"
					onClick={async () => {
						try {
							const response = await fetch(assets.mark[variant].svg);
							if (!response.ok) {
								toast.error("", {
									description: "Failed to copy Logo SVG to clipboard",
								});
								return;
							}
							await navigator.clipboard.writeText(await response.text());
							toast.success("", {
								description: "Logo SVG copied to clipboard",
							});
						} catch {
							toast.error("", {
								description: "Failed to copy Logo SVG to clipboard",
							});
						} finally {
							setOpen(false);
						}
					}}
					className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-hidden [&_svg]:size-4 [&_svg]:text-muted-foreground"
				>
					<Code />
					Copy Logo as SVG
				</button>
				<button
					type="button"
					onClick={async () => {
						try {
							const response = await fetch(assets.wordmark[variant].svg);
							if (!response.ok) {
								toast.error("", {
									description: "Failed to copy Wordmark SVG to clipboard",
								});
								return;
							}
							await navigator.clipboard.writeText(await response.text());
							toast.success("", {
								description: "Wordmark SVG copied to clipboard",
							});
						} catch {
							toast.error("", {
								description: "Failed to copy Wordmark SVG to clipboard",
							});
						} finally {
							setOpen(false);
						}
					}}
					className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-hidden [&_svg]:size-4 [&_svg]:text-muted-foreground"
				>
					<Type />
					Copy Wordmark as SVG
				</button>
				<button
					type="button"
					onClick={() => {
						const link = document.createElement("a");
						link.href = assets.assetsZip;
						link.download = "better-auth-brand-assets.zip";
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						toast.success("Downloading all assets...");
						setOpen(false);
					}}
					className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-hidden [&_svg]:size-4 [&_svg]:text-muted-foreground"
				>
					<Download />
					Download Brand Assets
				</button>
				<div className="-mx-1 my-1 h-px bg-border" />
				<Link
					href="/brand"
					onClick={() => setOpen(false)}
					className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer outline-hidden [&_svg]:size-4 [&_svg]:text-muted-foreground"
				>
					<Palette />
					Visit Brand Guidelines
				</Link>
			</Popover.Content>
		</Popover>
	);
}
