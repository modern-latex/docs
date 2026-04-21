"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { contents } from "@/components/contents";
import { VersionSwitcher } from "@/components/docs/version-switcher";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const pathname = usePathname();
	const search = useSearchContext();
	const navigation = useRef<HTMLElement>(null);
	const id = useId();

	const [opened, setOpened] = useState(() => {
		const match = contents.findIndex((section) => {
			const path = pathname.replace(/^\/docs\/beta/, "/docs");
			if (
				section.expandSectionForPathPrefix &&
				(path === section.expandSectionForPathPrefix ||
					path.startsWith(`${section.expandSectionForPathPrefix}/`))
			)
				return true;
			return section.list.some(
				(item) =>
					item.href === path ||
					item.subitems?.some(
						(sub) =>
							sub.href === path ||
							(item.href && path.startsWith(`${item.href}/`)),
					),
			);
		});
		return match === -1 ? 0 : match;
	});

	useEffect(() => {
		const match = contents.findIndex((section) => {
			const path = pathname.replace(/^\/docs\/beta/, "/docs");
			if (
				section.expandSectionForPathPrefix &&
				(path === section.expandSectionForPathPrefix ||
					path.startsWith(`${section.expandSectionForPathPrefix}/`))
			)
				return true;
			return section.list.some(
				(item) =>
					item.href === path ||
					item.subitems?.some(
						(sub) =>
							sub.href === path ||
							(item.href && path.startsWith(`${item.href}/`)),
					),
			);
		});
		if (match !== -1) setOpened(match);
	}, [pathname]);

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			const target = navigation.current?.querySelector<HTMLElement>(
				"[data-active='true']",
			);
			if (!target || !navigation.current) return;
			const host = navigation.current.getBoundingClientRect();
			const node = target.getBoundingClientRect();
			if (node.top < host.top || node.bottom > host.bottom) {
				target.scrollIntoView({ block: "center", behavior: "smooth" });
			}
		});
		return () => cancelAnimationFrame(frame);
	}, [pathname, opened]);

	return (
		<motion.aside
			initial={{ x: -24, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.28, ease: "easeOut" }}
			className="fixed left-0 top-(--landing-topbar-height) bottom-0 w-[22vw] max-w-75 hidden lg:flex flex-col z-30 bg-background border-r border-foreground/5"
		>
			<VersionSwitcher />

			<button
				type="button"
				className="group/search flex w-full items-center gap-2 px-4 py-2.25 border-b border-foreground/5 text-sm text-foreground/55 hover:text-foreground/80 hover:bg-foreground/3 transition-colors"
				onClick={() => search.setOpenSearch(true)}
			>
				<svg
					className="size-4 shrink-0 text-foreground opacity-55 group-hover/search:opacity-80 transition-opacity"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="11" cy="11" r="5.5" />
					<path d="m15 15l4 4" />
				</svg>
				<span className="truncate">Search</span>
				<kbd
					id={id}
					className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-mono text-foreground/40 border border-foreground/10 rounded-md px-1.5 py-0.5"
				>
					<span className="text-[11px]">&#8984;</span>K
				</kbd>
			</button>

			<nav
				ref={navigation}
				className="flex-1 overflow-y-auto overflow-x-hidden pb-3 sidebar-scroll"
				style={{
					maskImage:
						"linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 2rem), transparent 100%)",
				}}
			>
				<MotionConfig
					transition={{ duration: 0.35, type: "spring", bounce: 0 }}
				>
					<div className="flex flex-col">
						{contents.map((section, index) => {
							const visible = opened === index;
							return (
								<div key={section.title}>
									<button
										type="button"
										aria-expanded={visible}
										className={cn(
											"border-b border-foreground/6 w-full text-left flex gap-2 items-center px-4 py-2.5 transition-colors font-medium text-sm tracking-wider",
											visible
												? "text-foreground bg-foreground/3"
												: "text-foreground/70 hover:text-foreground hover:bg-foreground/3",
										)}
										onClick={() => setOpened(visible ? -1 : index)}
									>
										<section.Icon className="size-4.5" />
										<span className="grow tracking-normal">
											{section.title}
										</span>
										<ChevronDownIcon
											className={cn(
												"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
												visible && "rotate-180",
											)}
										/>
									</button>

									<AnimatePresence initial={false}>
										{visible && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="relative overflow-hidden"
											>
												<div className="text-sm pt-0 pb-1">
													{section.href && (
														<Link
															href={
																pathname.startsWith("/docs/beta")
																	? `/docs/beta${section.href.replace(/^\/docs/, "")}`
																	: section.href
															}
															data-active={
																pathname.replace(/^\/docs\/beta/, "/docs") ===
																	section.href || undefined
															}
															className={cn(
																"relative flex w-full items-center gap-2.5 px-4 py-1 text-[14px] transition-all duration-150",
																pathname.replace(/^\/docs\/beta/, "/docs") ===
																	section.href
																	? "text-foreground bg-foreground/6"
																	: "text-foreground/65 hover:text-foreground/90 hover:bg-foreground/3",
															)}
														>
															Overview
														</Link>
													)}
													{section.list.map((item, order) => {
														if (item.separator || item.group) {
															return (
																<div
																	key={`sep-${order}`}
																	className="flex flex-row items-center gap-2 mx-4 lg:mx-7 my-2"
																>
																	<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
																		{item.title}
																	</p>
																	<div className="grow h-px bg-border" />
																</div>
															);
														}

														if (item.external && item.href) {
															return (
																<Link
																	key={item.href}
																	href={item.href}
																	className="relative flex w-full items-center gap-2.5 px-4 py-1 text-[14px] text-foreground/65 hover:text-foreground/90 hover:bg-foreground/3 transition-all duration-150"
																>
																	<span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-3.5 text-foreground/65">
																		<item.icon className="text-foreground/75" />
																	</span>
																	<span className="min-w-0 grow truncate">
																		{item.title}
																	</span>
																	{item.isNew && (
																		<span className="pointer-events-none border border-dashed rounded-none px-1.5 py-0 text-[9px] uppercase tracking-wider text-foreground/55 border-foreground/25">
																			New
																		</span>
																	)}
																</Link>
															);
														}

														if (!item.href) return null;

														const active =
															pathname.replace(/^\/docs\/beta/, "/docs") ===
																item.href ||
															!!(
																item.subitems &&
																(item.subitems.some(
																	(sub) =>
																		sub.href ===
																		pathname.replace(/^\/docs\/beta/, "/docs"),
																) ||
																	pathname
																		.replace(/^\/docs\/beta/, "/docs")
																		.startsWith(`${item.href}/`))
															);

														return (
															<div key={item.href}>
																<Link
																	href={
																		pathname.startsWith("/docs/beta")
																			? `/docs/beta${item.href.replace(/^\/docs/, "")}`
																			: item.href
																	}
																	data-active={active || undefined}
																	className={cn(
																		"relative flex w-full items-center gap-2.5 px-4 py-1 text-[14px] transition-all duration-150",
																		active
																			? "text-foreground bg-foreground/6"
																			: "text-foreground/65 hover:text-foreground/90 hover:bg-foreground/3",
																	)}
																>
																	<span
																		className={cn(
																			"flex size-5 shrink-0 items-center justify-center [&>svg]:size-3.5 transition-colors duration-150",
																			active
																				? "text-foreground"
																				: "text-foreground/65",
																		)}
																	>
																		<item.icon className="text-foreground/75" />
																	</span>
																	<span className="min-w-0 grow truncate">
																		{item.title}
																	</span>
																	{item.isNew && (
																		<span
																			className={cn(
																				"pointer-events-none border border-dashed rounded-none px-1.5 py-0 text-[9px] uppercase tracking-wider",
																				active
																					? "border-solid bg-foreground/10 text-foreground"
																					: "text-foreground/55 border-foreground/25",
																			)}
																		>
																			New
																		</span>
																	)}
																</Link>

																<AnimatePresence initial={false}>
																	{active &&
																		item.subitems &&
																		item.subitems.length > 0 && (
																			<motion.div
																				initial={{ opacity: 0, height: 0 }}
																				animate={{ opacity: 1, height: "auto" }}
																				exit={{ opacity: 0, height: 0 }}
																				transition={{
																					duration: 0.35,
																					type: "spring",
																					bounce: 0,
																				}}
																				className="overflow-hidden"
																			>
																				<div className="relative before:absolute before:left-10 before:top-0 before:bottom-0 before:w-px before:bg-foreground/20">
																					{item.subitems.map((sub, place) => {
																						if (sub.group) {
																							return (
																								<div
																									key={`subgroup-${place}`}
																									className="flex flex-row items-center gap-2 pl-[calc(1.75rem+0.75rem+0.75rem)] pr-4 py-1.5 mt-1 first:mt-0"
																								>
																									<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
																										{sub.title}
																									</p>
																									<div className="grow h-px bg-border" />
																								</div>
																							);
																						}
																						if (!sub.href) return null;
																						const current =
																							pathname.replace(
																								/^\/docs\/beta/,
																								"/docs",
																							) === sub.href;
																						return (
																							<Link
																								key={sub.href}
																								href={
																									pathname.startsWith(
																										"/docs/beta",
																									)
																										? `/docs/beta${sub.href.replace(/^\/docs/, "")}`
																										: sub.href
																								}
																								data-active={
																									current || undefined
																								}
																								className={cn(
																									"relative flex items-center gap-1 pl-[calc(1.75rem+0.75rem+0.75rem)] pr-4 py-1 text-[13px] transition-all duration-150",
																									current
																										? "text-foreground bg-foreground/6"
																										: "text-foreground/55 hover:text-foreground/80 hover:bg-foreground/3",
																								)}
																							>
																								{sub.icon && (
																									<span
																										className={cn(
																											"min-w-4 [&>svg]:size-3 transition-colors duration-150",
																											current
																												? "text-foreground"
																												: "text-foreground/55",
																										)}
																									>
																										<sub.icon className="text-current" />
																									</span>
																								)}
																								<span className="truncate">
																									{sub.title}
																								</span>
																							</Link>
																						);
																					})}
																				</div>
																			</motion.div>
																		)}
																</AnimatePresence>
															</div>
														);
													})}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							);
						})}
					</div>
				</MotionConfig>
			</nav>

			<div className="flex items-center gap-1 p-2 border-t border-foreground/5 text-foreground/40">
				<a
					href="https://github.com/better-auth/better-auth"
					target="_blank"
					rel="noreferrer noopener"
					className="inline-flex items-center justify-center size-8 hover:text-foreground/70 hover:bg-foreground/5 transition-colors"
					aria-label="GitHub"
				>
					<svg
						role="img"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="size-4"
					>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
				</a>
				<div className="ms-auto [&_button]:text-foreground/40 [&_button:hover]:text-foreground/70">
					<ThemeProvider />
				</div>
			</div>
		</motion.aside>
	);
}
