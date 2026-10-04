"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Accordion } from "@mlatex/ui/src/components/accordion";
import { Badge } from "@mlatex/ui/src/components/badge";
import { icons } from "@mlatex/ui/src/icons";
import { cn } from "@mlatex/ui/src/lib/utils";
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

/** The app, where the log in button leads. */
const app = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

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
										{[
											{
												name: "GitHub",
												href: "https://github.com/modern-latex/mlatex",
												icon: icons.github,
											},
											{
												name: "Discord",
												href: "https://discord.gg/UUbPg5YtJF",
												icon: icons.discord,
											},
											{
												name: "Reddit",
												href: "https://www.reddit.com/r/mlatex",
												icon: icons.reddit,
											},
											{
												name: "X",
												href: "https://x.com/mlatex",
												icon: icons.x,
											},
											{
												name: "npm",
												href: "https://www.npmjs.com/package/mlatex",
												icon: icons.npm,
											},
											{
												name: "PyPI",
												href: "https://pypi.org/project/mlatex",
												icon: icons.python,
											},
										].map((site) => (
											<a
												key={site.name}
												href={site.href}
												target="_blank"
												rel="noreferrer"
												className="flex items-center justify-center p-1 text-foreground/55 dark:text-foreground/40 hover:text-foreground/75 transition-colors"
												aria-label={site.name}
												title={site.name}
											>
												<site.icon className="size-3.5" />
											</a>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: 0.185, ease: "easeOut" }}
						className="flex items-stretch shrink-0"
					>
						<Link
							href={`${app}/log-in`}
							className="flex items-center cursor-pointer gap-1.5 px-5 py-3 bg-foreground text-background hover:opacity-90 transition-colors duration-150"
						>
							<span className="font-mono text-xs uppercase tracking-wider">
								log-in
							</span>
							<svg
								className="h-2.5 w-2.5 opacity-50"
								viewBox="0 0 10 10"
								fill="none"
							>
								<path
									d="M1 9L9 1M9 1H3M9 1V7"
									stroke="currentColor"
									strokeWidth="1.2"
								/>
							</svg>
						</Link>
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
