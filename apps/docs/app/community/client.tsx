"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/landing/footer";
import { HalftoneBackground } from "@/components/landing/halftone-bg";
import { Github, Discord, Reddit, X, Star, Download, Users } from "@prostha/ui/src/icons";

export function Community() {
	return (
		<div className="relative min-h-dvh pt-14 lg:pt-0">
			<div className="relative text-foreground">
				<div className="flex flex-col lg:flex-row">
					<div className="hidden lg:block relative w-full shrink-0 lg:w-[30%] lg:h-dvh border-b lg:border-b-0 lg:border-r border-foreground/[0.06] overflow-clip px-5 sm:px-6 lg:px-10 lg:sticky lg:top-0">
						<div className="hidden lg:block">
							<HalftoneBackground />
						</div>
						<motion.div
							initial={false}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="relative w-full pt-6 md:pt-10 pb-6 lg:pb-0 flex flex-col justify-center lg:h-full"
						>
							<div className="space-y-6">
								<div className="space-y-2">
									<div className="flex items-center gap-1.5">
										<Users className="w-4 h-4 text-foreground/60" />
										<span className="text-sm text-foreground/60">Community</span>
									</div>
									<h1 className="text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight">
										Join the community,
										<br />
										<span className="text-foreground/50">build together.</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed max-w-[260px]">
										Connect with developers building with Better Auth.
									</p>
								</div>

								<div className="flex items-stretch gap-0 border border-foreground/[0.08]">
									<div className="flex-1 px-3 py-2.5 text-center border-r border-foreground/[0.08]">
										<p className="text-[9px] font-mono uppercase tracking-widest text-foreground/50 dark:text-foreground/45 mb-1">
											NPM
										</p>
										<p className="text-sm font-light text-foreground/80 tabular-nums">
											0
											<span className="text-[9px] text-foreground/50 font-mono">
												/week
											</span>
										</p>
									</div>
									<div className="flex-1 px-3 py-2.5 text-center border-r border-foreground/[0.08] bg-foreground/[0.03]">
										<p className="text-[9px] font-mono uppercase tracking-widest text-foreground/50 dark:text-foreground/45 mb-1">
											Stars
										</p>
										<p className="text-sm font-light text-foreground/80 tabular-nums">
											0
										</p>
									</div>
									<div className="flex-1 px-3 py-2.5 text-center">
										<p className="text-[9px] font-mono uppercase tracking-widest text-foreground/50 dark:text-foreground/45 mb-1">
											Discord
										</p>
										<p className="text-sm font-light text-foreground/80 tabular-nums">
											0
										</p>
									</div>
								</div>

								<div className="border-t border-foreground/10 pt-4 space-y-0">
									{[
										{ label: "Framework", value: "Open source" },
										{ label: "Contributors", value: "0+" },
										{ label: "License", value: "MIT" },
									].map((item, rank) => (
										<motion.div
											key={item.label}
											initial={false}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												duration: 0.25,
												delay: 0.3 + rank * 0.06,
												ease: "easeOut",
											}}
											className="flex items-baseline justify-between py-1.5 border-b border-dashed border-foreground/[0.06] last:border-0"
										>
											<span className="text-xs text-foreground/70 dark:text-foreground/50 uppercase tracking-wider">
												{item.label}
											</span>
											<span className="text-xs text-foreground/85 dark:text-foreground/75 font-mono">
												{item.value}
											</span>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					</div>

					<div className="relative w-full lg:w-[70%] overflow-x-hidden no-scrollbar">
						<div className="px-5 lg:p-8 lg:pt-20 space-y-8">
							<div className="lg:hidden relative border-b border-foreground/[0.06] overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6 mb-5">
								<HalftoneBackground />
								<div className="relative space-y-2 py-16">
									<div className="flex items-center gap-1.5">
										<Users className="w-4 h-4 text-foreground/60" />
										<span className="text-sm text-foreground/60">
											Community
										</span>
									</div>
									<h1 className="text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight">
										Join the community,
										<br />
										<span className="text-foreground/50">build together.</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed">
										Connect with developers building with Better Auth.
									</p>
								</div>
							</div>

							<h2 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-5">
								COMMUNITY
								<span className="flex-1 h-px bg-foreground/15" />
							</h2>

							<motion.div
								initial={false}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.05 }}
							>
								<p className="text-[10px] uppercase tracking-widest text-foreground/60 font-mono mb-5">
									# In Numbers
								</p>

								<div className="grid grid-cols-2 gap-0">
									{[
										{ icon: Download, label: "NPM Downloads", note: "/ week" },
										{ icon: Star, label: "GitHub Stars", note: "stars" },
										{ icon: Users, label: "Contributors", note: "people" },
										{ icon: Discord, label: "Discord Members", note: "members" },
									].map((metric, step) => (
										<motion.div
											key={metric.label}
											initial={false}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: 0.1 + step * 0.06, ease: "easeOut" }}
											className="relative border border-dashed border-foreground/[0.08] hover:border-foreground/[0.14] transition-all duration-300 group"
										>
											<div className="p-5">
												<div className="flex items-center gap-2 mb-3">
													<metric.icon className="w-4 h-4 text-foreground/40" />
													<span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">
														{metric.label}
													</span>
												</div>
												<div>
													<span className="text-4xl font-light text-foreground tabular-nums">
														0
													</span>
													<p className="text-[10px] text-foreground/40 font-mono mt-1">
														{metric.note}
													</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>

							<motion.div
								initial={false}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: 0.25 }}
							>
								<p className="text-[10px] uppercase tracking-widest text-foreground/60 font-mono mb-5">
									# Join Us On
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
									{[
										{
											name: "Discord",
											icon: Discord,
											href: "https://discord.gg/better-auth",
											action: "Join Discord",
											count: "0",
											label: "members",
										},
										{
											name: "GitHub",
											icon: Github,
											href: "https://github.com/better-auth/better-auth",
											action: "View on GitHub",
											count: "Open Source",
											label: "repository",
										},
										{
											name: "Reddit",
											icon: Reddit,
											href: "https://reddit.com/r/better_auth",
											action: "Join Subreddit",
											count: "0",
											label: "members",
										},
										{
											name: "X (Twitter)",
											icon: X,
											href: "https://x.com/better_auth",
											action: "Follow on X",
											count: "@better_auth",
											label: "handle",
										},
									].map((site, place) => (
										<motion.div
											key={site.name}
											initial={false}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: 0.2 + place * 0.06, ease: "easeOut" }}
											className="relative border border-dashed border-foreground/[0.08] hover:border-foreground/[0.14] transition-all duration-300 group"
										>
											<div className="flex flex-col h-full p-5">
												<div className="flex flex-col items-center gap-2 mb-3">
													<div className="bg-muted/20 border border-foreground/[0.06] p-2 rounded-full">
														<site.icon className="size-8 text-foreground/50" />
													</div>
													<h3 className="text-base font-mono uppercase tracking-widest text-foreground/40">
														{site.name}
													</h3>
												</div>

												<div className="border-t border-dashed border-foreground/[0.06] pt-3 mb-4">
													<div className="flex items-baseline justify-between">
														<span className="text-[9px] text-foreground/30 uppercase tracking-widest font-mono">
															{site.label}
														</span>
														<span className="text-xs text-foreground/60 font-mono">
															{site.count}
														</span>
													</div>
												</div>

												<Link
													href={site.href}
													target="_blank"
													rel="noreferrer"
													className="block"
												>
													<div className="w-full py-2.5 text-center border flex items-center justify-center border-dashed border-foreground/20 text-foreground/70 hover:text-foreground/90 hover:border-foreground/30 hover:bg-foreground/5 transition-all cursor-pointer">
														<span className="font-mono text-[10px] uppercase tracking-widest">
															{site.action}
														</span>
													</div>
												</Link>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		</div>
	);
}