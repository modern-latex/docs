"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Accordion } from "@prostha/ui/src/components/accordion";
import { Badge } from "@prostha/ui/src/components/badge";
import { cn } from "@prostha/ui/src/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronDownIcon,
	History,
	Palette,
	PencilLine,
	Scale,
	Search,
} from "lucide-react";

import { contents } from "@/components/contents";
import { ThemeProvider } from "@/components/theme-provider";
import { versions } from "@/lib/versions";

import { BetterAuthWordmark } from "../icons/logo";
import Brand from "./brand";

const CommunityIcon: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 20 20"
		className={className}
		aria-hidden="true"
	>
		<path
			fill="currentColor"
			d="M10 3a2 2 0 1 0 0 4a2 2 0 0 0 0-4M7 5a3 3 0 1 1 6 0a3 3 0 0 1-6 0M5.053 9.996q-.051.244-.051.504v.545l-2.631.705a.5.5 0 0 0-.354.612l.647 2.415A3 3 0 0 0 5.98 16.97c.23.31.495.594.789.843l-.171.05a4 4 0 0 1-4.9-2.828l-.647-2.415a1.5 1.5 0 0 1 1.061-1.837zm9.949 1.049V10.5q-.001-.26-.05-.504l2.94.788a1.5 1.5 0 0 1 1.06 1.837l-.647 2.415a4 4 0 0 1-5.07 2.778q.443-.376.789-.843a3 3 0 0 0 3.315-2.194l.648-2.415a.5.5 0 0 0-.354-.612zM15 6.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M16.5 4a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m-13 1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M1 6.5a2.5 2.5 0 1 1 5 0a2.5 2.5 0 0 1-5 0M7.5 9A1.5 1.5 0 0 0 6 10.5V14a4 4 0 0 0 8 0v-3.5A1.5 1.5 0 0 0 12.5 9zM7 10.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V14a3 3 0 1 1-6 0z"
		/>
	</svg>
);

const TimelinePattern: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		width="56"
		height="56"
		viewBox="0 0 56 56"
		fill="none"
		shapeRendering="geometricPrecision"
		className={className}
		aria-hidden="true"
	>
		<line x1="6" y1="6" x2="6" y2="50" stroke="currentColor" strokeWidth="1" />
		<circle cx="6" cy="10" r="1.75" fill="currentColor" />
		<circle cx="6" cy="28" r="1.75" fill="currentColor" />
		<circle cx="6" cy="46" r="1.75" fill="currentColor" />
		<line
			x1="14"
			y1="10"
			x2="50"
			y2="10"
			stroke="currentColor"
			strokeWidth="1"
		/>
		<line
			x1="14"
			y1="28"
			x2="40"
			y2="28"
			stroke="currentColor"
			strokeWidth="1"
		/>
		<line
			x1="14"
			y1="46"
			x2="32"
			y2="46"
			stroke="currentColor"
			strokeWidth="1"
		/>
	</svg>
);

const ScribblePattern: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		width="64"
		height="34"
		viewBox="0 0 64 34"
		fill="none"
		className={className}
		aria-hidden="true"
	>
		<path
			d="M2 14 C 8 2, 14 2, 18 14 S 28 26, 34 14 S 48 2, 54 14 S 62 20, 62 20"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			fill="none"
		/>
		<path
			d="M4 26 C 10 22, 20 28, 28 24 S 44 28, 52 24"
			stroke="currentColor"
			strokeWidth="1.1"
			strokeLinecap="round"
			fill="none"
			opacity="0.7"
		/>
	</svg>
);

export function Navigation() {
	const path = usePathname() || "/";
	const slug = versions.find(
		(v) => v.slug && path.startsWith(`/docs/${v.slug}`),
	)?.slug;

	const [resourcesOpen, setResourcesOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileView, setMobileView] = useState<"docs" | "nav">("docs");
	const [mobileDocSection, setMobileDocSection] = useState(-1);
	const timeout = useRef<NodeJS.Timeout>(undefined);

	useEffect(() => {
		document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileMenuOpen]);

	useEffect(() => {
		const mql = window.matchMedia("(min-width: 1024px)");
		const handle = () => {
			if (mql.matches) {
				setMobileMenuOpen(false);
			}
		};
		mql.addEventListener("change", handle);
		return () => mql.removeEventListener("change", handle);
	}, []);

	return (
		<>
			<div className="fixed top-0 left-0 right-0 z-[99] flex items-start pointer-events-none">
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.28, ease: "easeOut" }}
					className={cn(
						"hidden h-(--landing-topbar-height) items-stretch shrink-0 pointer-events-auto transition-[width] duration-300 ease-out",
						path.startsWith("/docs")
							? "w-[22vw] max-w-[300px]"
							: path === "/pricing" ||
									[
										"/blog",
										"/changelog",
										"/community",
										"/brand",
										"/legal",
									].some((p) => path === p || path.startsWith(`${p}/`))
								? "w-[30%]"
								: "w-[40%]",
						path === "/" ||
							path.startsWith("/docs") ||
							path === "/pricing" ||
							path === "/contact" ||
							["/blog", "/changelog", "/community", "/brand", "/legal"].some(
								(p) => path === p || path.startsWith(`${p}/`),
							)
							? "lg:flex"
							: "lg:hidden",
					)}
				>
					<Link
						href="/"
						className="flex h-full items-center gap-1 px-4 py-3 transition-colors duration-150"
					>
						<div className="flex flex-col gap-2 w-full">
							<Brand logo={<BetterAuthWordmark className="w-35 h-auto" />} />
						</div>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.28, ease: "easeOut" }}
					className="lg:hidden flex items-center justify-between w-full h-(--landing-topbar-height) pointer-events-auto bg-background border-b border-foreground/[0.06]"
				>
					<Link
						href="/"
						className="flex h-full items-center gap-1 px-4 transition-colors duration-150"
					>
						<BetterAuthWordmark className="w-35 h-auto" />
					</Link>
					<div className="flex items-center gap-1 pr-2">
						{path.startsWith("/docs") && (
							<button
								type="button"
								onClick={() => {
									window.dispatchEvent(
										new KeyboardEvent("keydown", {
											key: "k",
											metaKey: true,
											bubbles: true,
										}),
									);
								}}
								className="flex items-center justify-center size-8 text-foreground/50 hover:text-foreground/80 transition-colors"
								aria-label="Search"
							>
								<Search className="size-4" />
							</button>
						)}
						<div className="flex items-center justify-center size-8 text-foreground/50 [&_button]:text-foreground/50 [&_button:hover]:text-foreground/80">
							<ThemeProvider />
						</div>
						<button
							type="button"
							onClick={() => {
								const isOpening = !mobileMenuOpen;
								setMobileMenuOpen(isOpening);
								if (isOpening) {
									setMobileView(path.startsWith("/docs") ? "docs" : "nav");
									if (path.startsWith("/docs")) {
										const sectionIndex = contents.findIndex((section) => {
											const matchSegment = section.expandSectionForPathPrefix;
											if (
												matchSegment &&
												(path === matchSegment ||
													path.startsWith(`${matchSegment}/`))
											) {
												return true;
											}
											return section.list.some(
												(listItem) =>
													listItem.href === path ||
													(listItem.subitems?.length &&
														path.startsWith(`${listItem.href}/`)),
											);
										});
										setMobileDocSection(sectionIndex === -1 ? 0 : sectionIndex);
									}
								}
							}}
							className="flex items-center justify-center size-8 text-foreground/75 dark:text-foreground/60 hover:text-foreground/85 transition-colors"
						>
							{mobileMenuOpen ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"
									/>
								</svg>
							)}
						</button>
					</div>
				</motion.div>

				<motion.div
					initial={{ y: -10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.28, delay: 0.04, ease: "easeOut" }}
					className={cn(
						"flex-1 hidden lg:flex h-[calc(var(--landing-topbar-height)+1px)] items-stretch border-b bg-background pointer-events-auto min-w-0",
						path.startsWith("/docs") ? "border-foreground/5" : "",
					)}
				>
					{!(
						path === "/" ||
						path.startsWith("/docs") ||
						path === "/pricing" ||
						path === "/contact" ||
						["/blog", "/changelog", "/community", "/brand", "/legal"].some(
							(p) => path === p || path.startsWith(`${p}/`),
						)
					) && (
						<Link
							href="/"
							className={cn(
								"flex h-full items-center gap-1 shrink-0 px-4 lg:px-7 py-3 border-r transition-colors duration-150",
								path.startsWith("/docs")
									? "border-foreground/4"
									: "border-foreground/[0.06]",
							)}
						>
							<Brand logo={<BetterAuthWordmark className="w-35 h-auto" />} />
						</Link>
					)}
					{[
						{ name: "readme", href: "/" },
						{ name: "docs", href: "/docs" },
					].map((item, index) => {
						const active =
							item.href === "/docs"
								? path.startsWith("/docs")
								: path === item.href;
						return (
							<motion.div
								key={item.name}
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.2,
									delay: 0.05 + index * 0.03,
									ease: "easeOut",
								}}
								className="flex-1"
							>
								<Link
									href={item.href}
									className={cn(
										"group/tab relative flex items-center justify-center gap-1.5 px-2 xl:px-4 py-3 h-full border-r transition-colors duration-150",
										path.startsWith("/docs")
											? "border-foreground/4"
											: "border-foreground/[0.06]",
										active
											? cn(
													"bg-background border-b-2",
													path.startsWith("/docs")
														? "border-b-foreground/50"
														: "border-b-foreground/60",
												)
											: "bg-transparent hover:bg-foreground/[0.03]",
									)}
								>
									<span
										className={cn(
											"font-mono text-xs uppercase tracking-wider transition-colors duration-150 whitespace-nowrap",
											active
												? "text-foreground"
												: "text-foreground/65 dark:text-foreground/50 group-hover/tab:text-foreground/75",
										)}
									>
										{item.name}
									</span>
								</Link>
							</motion.div>
						);
					})}

					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.2,
							delay: 0.155,
							ease: "easeOut",
						}}
						className="flex-1"
					>
						<Link
							href="/contact"
							className={cn(
								"group/tab relative flex items-center justify-center gap-1.5 px-2 xl:px-4 py-3 h-full border-r transition-colors duration-150",
								path.startsWith("/docs")
									? "border-foreground/4"
									: "border-foreground/[0.06]",
								path === "/contact"
									? cn(
											"bg-background border-b-2",
											path.startsWith("/docs")
												? "border-b-foreground/50"
												: "border-b-foreground/60",
										)
									: "bg-transparent hover:bg-foreground/[0.03]",
							)}
						>
							<span
								className={cn(
									"font-mono text-xs uppercase tracking-wider transition-colors duration-150 whitespace-nowrap",
									path === "/contact"
										? "text-foreground"
										: "text-foreground/65 dark:text-foreground/50 group-hover/tab:text-foreground/75",
								)}
							>
								contact
							</span>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: 0.17, ease: "easeOut" }}
						className="relative flex-1"
						onMouseEnter={() => {
							clearTimeout(timeout.current);
							setResourcesOpen(true);
						}}
						onMouseLeave={() => {
							timeout.current = setTimeout(() => setResourcesOpen(false), 150);
						}}
					>
						<div
							className={cn(
								"group/tab flex items-center justify-center gap-1.5 px-2 xl:px-4 py-3 h-full cursor-pointer transition-colors duration-150",
								["/blog", "/changelog", "/community", "/brand", "/legal"].some(
									(p) => path === p || path.startsWith(`${p}/`),
								)
									? cn(
											"bg-background border-b-2",
											path.startsWith("/docs")
												? "border-b-foreground/50"
												: "border-b-foreground/60",
										)
									: resourcesOpen
										? "bg-foreground/[0.04]"
										: "hover:bg-foreground/[0.03]",
							)}
						>
							<span
								className={cn(
									"font-mono text-xs uppercase tracking-wider transition-colors duration-150 whitespace-nowrap",
									[
										"/blog",
										"/changelog",
										"/community",
										"/brand",
										"/legal",
									].some((p) => path === p || path.startsWith(`${p}/`))
										? "text-foreground"
										: resourcesOpen
											? "text-foreground/80"
											: "text-foreground/65 dark:text-foreground/50 group-hover/tab:text-foreground/75",
								)}
							>
								resources
							</span>
							<svg
								className={cn(
									"h-2 w-2 text-foreground/55 dark:text-foreground/40 transition-transform duration-200",
									resourcesOpen ? "rotate-180" : "",
								)}
								viewBox="0 0 10 6"
								fill="none"
							>
								<path
									d="M1 1L5 5L9 1"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
							</svg>
						</div>

						<AnimatePresence>
							{resourcesOpen && (
								<motion.div
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
									className={cn(
										"absolute top-full right-0 z-50 w-[480px] max-w-[calc(100vw-2rem)] border bg-background shadow-2xl shadow-black/20 dark:shadow-black/60",
										path.startsWith("/docs")
											? "border-foreground/6"
											: "border-foreground/[0.08]",
									)}
								>
									<div className="grid grid-cols-2 divide-x divide-foreground/[0.06]">
										{[
											{
												title: "Blog",
												tagline: "Writing",
												description: "Engineering, product, and updates",
												href: "/blog",
												Icon: PencilLine,
												Pattern: ScribblePattern,
												patternClassName:
													"absolute right-3 top-3 text-foreground/30 group-hover/p:text-foreground/60 transition-colors duration-200 pointer-events-none",
											},
											{
												title: "Changelog",
												tagline: "Shipped",
												description: "Latest releases and improvements",
												href: "/changelog",
												Icon: History,
												Pattern: TimelinePattern,
												patternClassName:
													"absolute right-3 top-3 text-foreground/30 group-hover/p:text-foreground/60 transition-colors duration-200 pointer-events-none",
											},
										].map((resource) => (
											<Link
												key={resource.title}
												href={resource.href}
												onClick={() => setResourcesOpen(false)}
												className="group/p relative flex h-full flex-col gap-2.5 p-4 overflow-hidden hover:bg-foreground/[0.03] transition-colors"
											>
												{resource.Pattern && (
													<resource.Pattern
														className={
															resource.patternClassName ??
															"absolute right-0 top-0 text-foreground/[0.09] group-hover/p:text-foreground/25 transition-colors duration-200 pointer-events-none"
														}
													/>
												)}
												<div className="relative flex items-center">
													<span className="flex size-8 items-center justify-center border border-foreground/[0.1] text-foreground/70 group-hover/p:text-foreground group-hover/p:border-foreground/25 transition-colors bg-background">
														<resource.Icon className="size-4" />
													</span>
												</div>
												<div className="relative flex flex-col gap-0.5">
													<span className="text-[13px] font-medium text-foreground/90 group-hover/p:text-foreground transition-colors">
														{resource.title}
													</span>
													<span className="text-[11px] leading-relaxed text-foreground/55 dark:text-foreground/45">
														{resource.description}
													</span>
												</div>
											</Link>
										))}
									</div>

									<div className="grid grid-cols-3 divide-x divide-foreground/[0.06] border-t border-foreground/[0.06]">
										{[
											{
												title: "Community",
												href: "/community",
												Icon: CommunityIcon,
											},
											{ title: "Brand", href: "/brand", Icon: Palette },
											{ title: "Legal", href: "/legal", Icon: Scale },
										].map((resource) => (
											<Link
												key={resource.title}
												href={resource.href}
												onClick={() => setResourcesOpen(false)}
												className="group/p relative flex items-center gap-2 px-3 py-3 hover:bg-foreground/[0.03] transition-colors"
											>
												<resource.Icon className="size-3.5 text-foreground/55 group-hover/p:text-foreground/80 transition-colors" />
												<span className="text-[12px] font-medium text-foreground/75 group-hover/p:text-foreground transition-colors">
													{resource.title}
												</span>
											</Link>
										))}
									</div>
									<div className="grid w-full grid-cols-[repeat(auto-fit,minmax(1.75rem,1fr))] items-center justify-items-center gap-y-0.5 border-t border-foreground/[0.06] px-2 py-2">
										<a
											href="https://github.com/prostha/docs"
											target="_blank"
											rel="noreferrer"
											className="flex items-center justify-center p-1 text-foreground/55 dark:text-foreground/40 hover:text-foreground/75 transition-colors"
											aria-label="GitHub"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 256 250"
											>
												<path
													fill="currentColor"
													d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46c6.397 1.185 8.746-2.777 8.746-6.158c0-3.052-.12-13.135-.174-23.83c-35.61 7.742-43.124-15.103-43.124-15.103c-5.823-14.795-14.213-18.73-14.213-18.73c-11.613-7.944.876-7.78.876-7.78c12.853.902 19.621 13.19 19.621 13.19c11.417 19.568 29.945 13.911 37.249 10.64c1.149-8.272 4.466-13.92 8.127-17.116c-28.431-3.236-58.318-14.212-58.318-63.258c0-13.975 5-25.394 13.188-34.358c-1.329-3.224-5.71-16.242 1.24-33.874c0 0 10.749-3.44 35.21 13.121c10.21-2.836 21.16-4.258 32.038-4.307c10.878.049 21.837 1.47 32.066 4.307c24.431-16.56 35.165-13.12 35.165-13.12c6.967 17.63 2.584 30.65 1.255 33.873c8.207 8.964 13.173 20.383 13.173 34.358c0 49.163-29.944 59.988-58.447 63.157c4.591 3.972 8.682 11.762 8.682 23.704c0 17.126-.148 30.91-.148 35.126c0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002C256 57.307 198.691 0 128.001 0"
												/>
											</svg>
										</a>
										<a
											href="https://discord.gg/3gFJ5Put6k"
											target="_blank"
											rel="noreferrer"
											className="flex items-center justify-center p-1 text-foreground/55 dark:text-foreground/40 hover:text-foreground/75 transition-colors"
											aria-label="Discord"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="M19.303 5.337A17.3 17.3 0 0 0 14.963 4c-.191.329-.403.775-.552 1.125a16.6 16.6 0 0 0-4.808 0C9.454 4.775 9.23 4.329 9.05 4a17 17 0 0 0-4.342 1.337C1.961 9.391 1.218 13.35 1.59 17.255a17.7 17.7 0 0 0 5.318 2.664a13 13 0 0 0 1.136-1.836c-.627-.234-1.22-.52-1.794-.86c.149-.106.297-.223.435-.34c3.46 1.582 7.207 1.582 10.624 0c.149.117.287.234.435.34c-.573.34-1.167.626-1.793.86a13 13 0 0 0 1.135 1.836a17.6 17.6 0 0 0 5.318-2.664c.457-4.52-.722-8.448-3.1-11.918M8.52 14.846c-1.04 0-1.889-.945-1.889-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.888 2.102c0 1.156-.838 2.1-1.889 2.1m6.974 0c-1.04 0-1.89-.945-1.89-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.889 2.102c0 1.156-.828 2.1-1.89 2.1"
												/>
											</svg>
										</a>
										<a
											href="https://reddit.com/r/prostha"
											target="_blank"
											rel="noreferrer"
											className="flex items-center justify-center p-1 text-foreground/55 dark:text-foreground/40 hover:text-foreground/75 transition-colors"
											aria-label="Reddit"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 256 256"
											>
												<circle cx="128" cy="128" r="128" fill="currentColor" />
												<path
													fill="currentColor"
													className="text-background"
													d="M213.15 129.22c0-10.376-8.391-18.617-18.617-18.617a18.74 18.74 0 0 0-12.97 5.189c-12.818-9.157-30.368-15.107-49.9-15.87l8.544-39.981l27.773 5.95c.307 7.02 6.104 12.667 13.278 12.667c7.324 0 13.275-5.95 13.275-13.278c0-7.324-5.95-13.275-13.275-13.275c-5.188 0-9.768 3.052-11.904 7.478l-30.976-6.562c-.916-.154-1.832 0-2.443.458c-.763.458-1.22 1.22-1.371 2.136l-9.464 44.558c-19.837.612-37.692 6.562-50.662 15.872a18.74 18.74 0 0 0-12.971-5.188c-10.377 0-18.617 8.391-18.617 18.617c0 7.629 4.577 14.037 10.988 16.939a33.6 33.6 0 0 0-.458 5.646c0 28.686 33.42 52.036 74.621 52.036c41.202 0 74.622-23.196 74.622-52.036a35 35 0 0 0-.458-5.646c6.408-2.902 10.985-9.464 10.985-17.093M85.272 142.495c0-7.324 5.95-13.275 13.278-13.275c7.324 0 13.275 5.95 13.275 13.275s-5.95 13.278-13.275 13.278c-7.327.15-13.278-5.953-13.278-13.278m74.317 35.251c-9.156 9.157-26.553 9.768-31.588 9.768c-5.188 0-22.584-.765-31.59-9.768c-1.371-1.373-1.371-3.51 0-4.883c1.374-1.371 3.51-1.371 4.884 0c5.8 5.8 18.008 7.782 26.706 7.782s21.058-1.983 26.704-7.782c1.374-1.371 3.51-1.371 4.884 0c1.22 1.373 1.22 3.51 0 4.883m-2.443-21.822c-7.325 0-13.275-5.95-13.275-13.275s5.95-13.275 13.275-13.275c7.327 0 13.277 5.95 13.277 13.275c0 7.17-5.95 13.275-13.277 13.275"
												/>
											</svg>
										</a>
										<a
											href="https://x.com/prostha"
											target="_blank"
											rel="noreferrer"
											className="flex items-center justify-center p-1 text-foreground/55 dark:text-foreground/40 hover:text-foreground/75 transition-colors"
											aria-label="X"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
												/>
											</svg>
										</a>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.div>
			</div>

			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="lg:hidden fixed inset-0 z-[98] w-full bg-background/95 backdrop-blur-sm pointer-events-auto"
					>
						<div className="flex h-full flex-col pt-(--landing-topbar-height)">
							<div className="flex-1 min-h-0 overflow-y-auto">
								{path.startsWith("/docs") && mobileView === "docs" ? (
									<>
										<button
											type="button"
											onClick={() => setMobileView("nav")}
											className="flex items-center gap-2 w-full px-5 py-2.5 text-foreground/65 dark:text-foreground/45 hover:text-foreground/70 transition-colors border-b border-foreground/6"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
											>
												<path
													fill="currentColor"
													d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"
												/>
											</svg>
											<span className="font-mono text-[10px] uppercase tracking-wider">
												Menu
											</span>
										</button>

										<div className="flex flex-col">
											{contents.map((section, sectionIndex) => (
												<div key={section.title}>
													<button
														type="button"
														className={cn(
															"border-b border-foreground/6 w-full text-left flex gap-2 items-center px-5 py-3 transition-colors",
															"font-medium text-sm tracking-wider",
															mobileDocSection === sectionIndex
																? "text-foreground bg-foreground/3"
																: "text-foreground/70 hover:text-foreground hover:bg-foreground/3",
														)}
														onClick={() =>
															setMobileDocSection((previousState) =>
																previousState === sectionIndex
																	? -1
																	: sectionIndex,
															)
														}
													>
														<section.Icon className="size-4.5" />
														<span className="grow">{section.title}</span>
														<ChevronDownIcon
															className={cn(
																"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
																mobileDocSection === sectionIndex
																	? "rotate-180"
																	: "",
															)}
														/>
													</button>
													{mobileDocSection === sectionIndex && (
														<div className="relative overflow-hidden">
															<div className="text-sm pt-0 pb-1">
																{section.href && (
																	<Link
																		href={
																			slug
																				? `/docs/${slug}${section.href.replace(/^\/docs/, "")}`
																				: section.href
																		}
																		onClick={() => setMobileMenuOpen(false)}
																		data-active={
																			path === section.href || undefined
																		}
																		className={cn(
																			"relative flex items-center gap-2.5 px-5 py-1.5 text-[14px] transition-all duration-150",
																			path === section.href
																				? "text-foreground bg-foreground/6"
																				: "text-foreground/75 dark:text-foreground/60 hover:text-foreground/90 hover:bg-foreground/3",
																		)}
																	>
																		<span className="truncate">Overview</span>
																	</Link>
																)}
																{section.list.map((listItem, listItemIndex) => {
																	if (listItem.separator || listItem.group) {
																		return (
																			<div
																				key={`sep-${listItem.title}-${listItemIndex}`}
																				className="flex flex-row items-center gap-2 mx-5 my-2"
																			>
																				<p className="text-[10px] text-foreground/65 dark:text-foreground/45 uppercase tracking-wider">
																					{listItem.title}
																				</p>
																				<div className="grow h-px bg-border" />
																			</div>
																		);
																	}
																	if (listItem.external && listItem.href) {
																		return (
																			<Link
																				key={listItem.href}
																				href={listItem.href}
																				onClick={() => setMobileMenuOpen(false)}
																				className={cn(
																					"relative flex w-full items-center gap-2.5 px-5 py-1.5 text-[14px] transition-all duration-150",
																					"text-foreground/75 dark:text-foreground/60 hover:text-foreground/90 hover:bg-foreground/3",
																				)}
																			>
																				<span className="text-foreground/75 transition-colors duration-150 dark:text-foreground/60">
																					<span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-[14px]">
																						<listItem.icon className="text-foreground/75" />
																					</span>
																				</span>
																				<span className="min-w-0 grow truncate">
																					{listItem.title}
																				</span>
																				{listItem.isNew && (
																					<Badge
																						className="pointer-events-none border-dashed rounded-none px-1.5 py-0 text-[9px] uppercase tracking-wider text-foreground/70 dark:text-foreground/55 border-foreground/25"
																						variant="outline"
																					>
																						New
																					</Badge>
																				)}
																			</Link>
																		);
																	}
																	if (!listItem.href) return null;
																	const active =
																		path === listItem.href ||
																		(!!listItem.subitems?.length &&
																			path.startsWith(`${listItem.href}/`));
																	return (
																		<Link
																			key={listItem.href}
																			href={
																				slug
																					? `/docs/${slug}${listItem.href.replace(/^\/docs/, "")}`
																					: listItem.href
																			}
																			onClick={() => setMobileMenuOpen(false)}
																			data-active={active || undefined}
																			className={cn(
																				"relative flex w-full items-center gap-2.5 px-5 py-1.5 text-[14px] transition-all duration-150",
																				active
																					? "text-foreground bg-foreground/6"
																					: "text-foreground/75 dark:text-foreground/60 hover:text-foreground/90 hover:bg-foreground/3",
																			)}
																		>
																			<span
																				className={cn(
																					"transition-colors duration-150",
																					active
																						? "text-foreground"
																						: "text-foreground/75 dark:text-foreground/60",
																				)}
																			>
																				<span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-[14px]">
																					<listItem.icon className="text-foreground/75" />
																				</span>
																			</span>
																			<span className="min-w-0 grow truncate">
																				{listItem.title}
																			</span>
																			{listItem.isNew && (
																				<Badge
																					className={cn(
																						"pointer-events-none border-dashed rounded-none px-1.5 py-0 text-[9px] uppercase tracking-wider",
																						active
																							? "border-solid bg-foreground/10 text-foreground"
																							: "text-foreground/70 dark:text-foreground/55 border-foreground/25",
																					)}
																					variant="outline"
																				>
																					New
																				</Badge>
																			)}
																		</Link>
																	);
																})}
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</>
								) : (
									<>
										{path.startsWith("/docs") && mobileView === "nav" && (
											<button
												type="button"
												onClick={() => setMobileView("docs")}
												className="flex items-center gap-2 w-full px-5 py-2.5 text-foreground/65 dark:text-foreground/45 hover:text-foreground/70 transition-colors border-b border-foreground/6"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="12"
													height="12"
													viewBox="0 0 24 24"
												>
													<path
														fill="currentColor"
														d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"
													/>
												</svg>
												<span className="font-mono text-[10px] uppercase tracking-wider">
													Docs
												</span>
											</button>
										)}

										{[
											{ name: "readme", href: "/" },
											{ name: "docs", href: "/docs" },
										].map((item) => {
											const active =
												item.href === "/docs"
													? path.startsWith("/docs")
													: path === item.href;
											return (
												<Link
													key={item.name}
													href={item.href}
													onClick={() => setMobileMenuOpen(false)}
													className={cn(
														"flex items-center gap-2.5 px-5 py-3.5 border-b border-foreground/6 transition-colors font-mono text-base uppercase tracking-wider",
														active
															? "text-foreground bg-foreground/4"
															: "text-foreground/75 dark:text-foreground/60 hover:bg-foreground/3",
													)}
												>
													{item.name}
												</Link>
											);
										})}

										<Accordion
											type="multiple"
											value={[
												...[{ name: "resources" }, { name: "contact" }]
													.filter((sectionItem) => {
														if (sectionItem.name === "resources") {
															return [
																"/blog",
																"/changelog",
																"/community",
																"/brand",
																"/legal",
															].some(
																(p) => path === p || path.startsWith(`${p}/`),
															);
														}
														return false;
													})
													.map((sectionItem) => sectionItem.name),
											]}
											className="w-full"
										>
											<Accordion.Item value="resources">
												<Accordion.Trigger className="px-5 py-3.5 font-mono text-base uppercase tracking-wider text-foreground/75 dark:text-foreground/60 hover:text-foreground hover:no-underline">
													resources
												</Accordion.Trigger>
												<Accordion.Content className="pb-0">
													{[
														{ name: "blog", href: "/blog" },
														{ name: "changelog", href: "/changelog" },
														{ name: "community", href: "/community" },
														{ name: "brand", href: "/brand" },
														{ name: "legal", href: "/legal" },
													].map((item) => (
														<Link
															key={item.name}
															href={item.href}
															onClick={() => setMobileMenuOpen(false)}
															className={cn(
																"flex items-center gap-2.5 pl-9 pr-5 py-2.5 transition-colors font-mono text-sm uppercase tracking-wider",
																path === item.href ||
																	path.startsWith(`${item.href}/`)
																	? "text-foreground bg-foreground/4"
																	: "text-foreground/60 dark:text-foreground/45 hover:text-foreground hover:bg-foreground/3",
															)}
														>
															{item.name}
														</Link>
													))}
												</Accordion.Content>
											</Accordion.Item>

											<Accordion.Item value="contact">
												<Link
													href="/contact"
													onClick={() => setMobileMenuOpen(false)}
													className={cn(
														"flex items-center gap-2.5 px-5 py-3.5 transition-colors font-mono text-base uppercase tracking-wider",
														path === "/contact"
															? "text-foreground bg-foreground/4"
															: "text-foreground/75 dark:text-foreground/60 hover:text-foreground",
													)}
												>
													contact
												</Link>
											</Accordion.Item>
										</Accordion>
									</>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
