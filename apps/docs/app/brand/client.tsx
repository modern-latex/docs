"use client";

import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import Footer from "@/components/landing/footer";
import { Alert } from "@prostha/ui/src/components/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@prostha/ui/src/components/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@prostha/ui/src/components/card";
import { Input } from "@prostha/ui/src/components/input";
import { Tabs } from "@prostha/ui/src/components/tabs";
import { assets } from "@/lib/brand";

const canvas = typeof window === "undefined"
	? Promise.resolve(null)
	: new Promise<CanvasRenderingContext2D | null>((resolveContext) => {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		resolveContext(canvas.getContext("2d"));
	});

const element = typeof window === "undefined"
	? null
	: (() => {
		const div = document.createElement("div");
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.pointerEvents = "none";
		document.body.appendChild(div);
		return div;
	})();

function resolve(css?: string, tailwind?: string, canvas?: CanvasRenderingContext2D | null) {
	if (!canvas || !element) return "";
	
	if (css) {
		element.className = "";
		element.style.backgroundColor = `var(--${css})`;
	} else if (tailwind) {
		element.style.backgroundColor = "";
		element.className = tailwind;
	}

	const background = getComputedStyle(element).backgroundColor;
	if (!background) return "";

	canvas.clearRect(0, 0, 1, 1);
	canvas.fillStyle = "#00000000";
	canvas.fillRect(0, 0, 1, 1);
	canvas.fillStyle = background;
	canvas.fillRect(0, 0, 1, 1);

	const [red, green, blue] = canvas.getImageData(0, 0, 1, 1).data;
	return `#${Math.round(red).toString(16).padStart(2, "0").toUpperCase()}${Math.round(green).toString(16).padStart(2, "0").toUpperCase()}${Math.round(blue).toString(16).padStart(2, "0").toUpperCase()}`;
}

export function Brand() {
	const context = use(canvas);

	return (
		<div className="relative min-h-dvh pt-14 lg:pt-0">
			<div className="relative text-foreground">
				<div className="flex flex-col lg:flex-row">
					<aside className="hidden lg:block relative w-full shrink-0 lg:w-[30%] lg:h-dvh border-b lg:border-b-0 lg:border-r border-foreground/[0.06] overflow-clip px-5 sm:px-6 lg:px-10 lg:sticky lg:top-0">
						<div className="absolute inset-0 bg-grid text-foreground/[0.04] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
						<div className="relative w-full pt-6 md:pt-10 pb-6 lg:pb-0 flex flex-col justify-center lg:h-full">
							<div className="space-y-6">
								<div className="space-y-2">
									<p className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">
										Design System
									</p>
									<h1 className="text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight">
										<span className="underline underline-offset-4 decoration-foreground/40">
											Brand
										</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed max-w-[280px]">
										The tokens, components, and motifs that make up the Better Auth
										visual language. Everything here is pulled live from the same
										variables used across product and docs.
									</p>
								</div>

								<nav className="border-t border-foreground/10 pt-4 space-y-0">
									{[
										{ label: "Foundations", href: "#foundations" },
										{ label: "Motifs", href: "#motifs" },
										{ label: "Components", href: "#components" },
										{ label: "Logo", href: "#logo" },
										{ label: "Voice", href: "#voice" },
									].map((item, index) => (
										<Link
											key={item.href}
											href={item.href}
											className="flex items-baseline justify-between py-1.5 border-b border-dashed border-foreground/[0.06] last:border-0 group"
										>
											<span className="text-[11px] text-foreground/70 dark:text-foreground/50 uppercase tracking-wider group-hover:text-foreground/90 transition-colors">
												{item.label}
											</span>
											<span className="text-[11px] text-foreground/40 font-mono">
												0{index + 1}
											</span>
										</Link>
									))}
								</nav>

								<div className="flex items-center gap-3 pt-1">
									<a
										href={assets.assetsZip}
										className="inline-flex items-center gap-1.5 px-5 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-colors"
									>
										Download assets
									</a>
								</div>
							</div>
						</div>
					</aside>

					<div className="relative w-full lg:w-[70%] overflow-x-hidden no-scrollbar">
						<div className="px-5 sm:px-6 lg:px-10 lg:pt-16 pb-10">
							<div className="lg:hidden relative border-b border-foreground/[0.06] overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6 mb-5">
								<div className="absolute inset-0 bg-grid text-foreground/[0.04] pointer-events-none" />
								<div className="relative space-y-2 py-12">
									<p className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">
										Design System
									</p>
									<h1 className="text-2xl md:text-3xl tracking-tight leading-tight">
										<span className="underline underline-offset-4 decoration-foreground/40">
											Brand
										</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed">
										The tokens, components, and motifs that make up Better Auth.
									</p>
								</div>
							</div>

							<div className="space-y-16 pt-4 lg:pt-0">
								<section id="foundations" className="scroll-mt-24 space-y-8">
									<div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
										<h2 className="text-lg md:text-xl tracking-tight">Foundations</h2>
										<span className="text-[11px] font-mono text-foreground/40">01</span>
									</div>
									<div className="space-y-10">
										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Color</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													The palette that makes up every surface in the product. Click a swatch to copy its hex.
												</p>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
												{[
													{ name: "background", label: "Background" },
													{ name: "foreground", label: "Foreground" },
													{ name: "primary", label: "Primary" },
													{ name: "primary-foreground", label: "Primary FG" },
													{ name: "secondary", label: "Secondary" },
													{ name: "secondary-foreground", label: "Secondary FG" },
													{ name: "muted", label: "Muted" },
													{ name: "muted-foreground", label: "Muted FG" },
													{ name: "accent", label: "Accent" },
													{ name: "accent-foreground", label: "Accent FG" },
													{ name: "border", label: "Border" },
													{ name: "input", label: "Input" },
													{ name: "ring", label: "Ring" },
													{ name: "destructive", label: "Destructive" },
												].map((token) => {
													const [hexValue, setHexValue] = useState<string>("");
													const [copied, setCopied] = useState(false);

													useEffect(() => {
														const update = () => setHexValue(resolve(token.name, undefined, context));
														update();
														const observer = new MutationObserver(update);
														observer.observe(document.documentElement, {
															attributes: true,
															attributeFilter: ["class", "data-theme", "style"],
														});
														return () => observer.disconnect();
													}, [token.name, context]);

													const handleCopy = () => {
														if (!hexValue) return;
														navigator.clipboard?.writeText(hexValue);
														setCopied(true);
														setTimeout(() => setCopied(false), 1200);
													};

													return (
														<button
															key={token.name}
															type="button"
															onClick={handleCopy}
															className="bg-background p-3 space-y-2 text-left hover:bg-foreground/[0.02] transition-colors"
														>
															<div className="h-14 w-full border border-foreground/10" style={{ backgroundColor: `var(--${token.name})` }} />
															<div className="space-y-0.5">
																<div className="flex items-baseline justify-between gap-2">
																	<p className="text-[11px] font-medium">{token.label}</p>
																	<p className="text-[10px] font-mono text-foreground/60">{copied ? "Copied" : hexValue || "—"}</p>
																</div>
																<p className="text-[10px] font-mono text-foreground/45">--{token.name}</p>
															</div>
														</button>
													);
												})}
											</div>
											<div className="space-y-2 pt-2">
												<p className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">
													Callout accents
												</p>
												<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
													{[
														{ name: "info", color: "bg-blue-500", label: "Info" },
														{ name: "warn", color: "bg-orange-500", label: "Warn" },
														{ name: "error", color: "bg-red-500", label: "Error" },
														{ name: "success", color: "bg-green-500", label: "Success" },
													].map((accent) => {
														const [hexValue, setHexValue] = useState<string>("");
														const [copied, setCopied] = useState(false);

														useEffect(() => {
															const update = () => setHexValue(resolve(undefined, accent.color, context));
															update();
															const observer = new MutationObserver(update);
															observer.observe(document.documentElement, {
																attributes: true,
																attributeFilter: ["class", "data-theme", "style"],
															});
															return () => observer.disconnect();
														}, [accent.color, context]);

														const handleCopy = () => {
															if (!hexValue) return;
															navigator.clipboard?.writeText(hexValue);
															setCopied(true);
															setTimeout(() => setCopied(false), 1200);
														};

														return (
															<button
																key={accent.name}
																type="button"
																onClick={handleCopy}
																className="border border-foreground/10 flex items-center gap-2 p-2 text-left hover:bg-foreground/[0.02] transition-colors"
															>
																<span className={`h-6 w-1 ${accent.color}`} />
																<div className="flex-1 flex items-baseline justify-between gap-2">
																	<span className="text-[11px] font-medium">{accent.label}</span>
																	<span className="text-[10px] font-mono text-foreground/60">{copied ? "Copied" : hexValue || "—"}</span>
																</div>
															</button>
														);
													})}
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Typography</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													Geist for UI, Geist Mono for code and metadata.
												</p>
											</div>
											<div className="divide-y divide-foreground/10 border border-foreground/10">
												{[
													{ label: "Geist Sans · H1", meta: "text-4xl tracking-tight", className: "text-4xl tracking-tight", children: "Authentication, better." },
													{ label: "Geist Sans · H2", meta: "text-xl tracking-tight", className: "text-xl tracking-tight", children: "Drop-in, framework-agnostic." },
													{ label: "Geist Sans · Body", meta: "text-sm", className: "text-sm text-foreground/80", children: "The quick brown fox jumps over the lazy dog. 0123456789." },
													{ label: "Geist Mono · Label", meta: "text-[11px] font-mono uppercase tracking-wider", className: "text-[11px] font-mono uppercase tracking-wider text-foreground/70", children: "api / better-auth / v1.4.0" },
													{ label: "Geist Mono · Code", meta: "font-mono text-sm", className: "font-mono text-sm text-foreground/80", children: "const auth = betterAuth({ secret, baseURL });" },
												].map((row) => (
													<div key={row.label} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 p-4">
														<div className="space-y-0.5">
															<p className="text-[11px] font-medium">{row.label}</p>
															<p className="text-[10px] font-mono text-foreground/50">{row.meta}</p>
														</div>
														<div className={row.className}>
															{row.children}
														</div>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Radius</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													Base is 0.2rem — deliberately tight. Code blocks and inline callouts break to 0 for a sharper, more editorial feel.
												</p>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
												{[
													{ label: "sharp (code)", value: "0" },
													{ label: "sm", value: "calc(var(--radius) - 2px)" },
													{ label: "md", value: "calc(var(--radius) - 1px)" },
													{ label: "lg (default)", value: "var(--radius)" },
													{ label: "xl", value: "calc(var(--radius) + 4px)" },
												].map((radius) => (
													<div key={radius.label} className="border border-foreground/10 p-3 space-y-3">
														<div className="h-12 w-full bg-foreground/5 border border-foreground/10" style={{ borderRadius: radius.value }} />
														<div className="space-y-0.5">
															<p className="text-[11px] font-medium">{radius.label}</p>
															<p className="text-[10px] font-mono text-foreground/50">{radius.value}</p>
														</div>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Shadow</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													Shadows are used sparingly — only to lift interactive affordances. Code blocks and cards stay flat.
												</p>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 border border-foreground/10">
												{[
													{ label: "xs", token: "shadow-xs" },
													{ label: "sm", token: "shadow-sm" },
													{ label: "md", token: "shadow-md" },
													{ label: "lg", token: "shadow-lg" },
													{ label: "xl", token: "shadow-xl" },
												].map((shadow) => (
													<div key={shadow.token} className="space-y-2 text-center">
														<div className={`h-14 w-full bg-background border border-foreground/10 ${shadow.token}`} />
														<p className="text-[11px] font-mono text-foreground/50">{shadow.token}</p>
													</div>
												))}
											</div>
										</div>
									</div>
								</section>

								<section id="motifs" className="scroll-mt-24 space-y-8">
									<div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
										<h2 className="text-lg md:text-xl tracking-tight">Motifs</h2>
										<span className="text-[11px] font-mono text-foreground/40">02</span>
									</div>
									<div className="space-y-10">
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
											{[
												{ label: "Grid · 32px", meta: ".bg-grid", className: "bg-grid text-foreground/20" },
												{ label: "Grid · 8px", meta: ".bg-grid-small", className: "bg-grid-small text-foreground/20" },
												{ label: "Dot · 16px", meta: ".bg-dot", className: "bg-dot text-foreground/30" },
											].map((motif) => (
												<div key={motif.label} className="border border-foreground/10">
													<div className={`h-36 w-full ${motif.className}`} />
													<div className="flex items-baseline justify-between border-t border-foreground/10 px-3 py-2">
														<p className="text-[11px] font-medium">{motif.label}</p>
														<p className="text-[10px] font-mono text-foreground/50">{motif.meta}</p>
													</div>
												</div>
											))}
										</div>
									</div>
								</section>

								<section id="components" className="scroll-mt-24 space-y-8">
									<div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
										<h2 className="text-lg md:text-xl tracking-tight">Components</h2>
										<span className="text-[11px] font-mono text-foreground/40">03</span>
									</div>
									<div className="space-y-10">
										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Buttons</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">Six variants, four sizes.</p>
											</div>
											<div className="border border-foreground/10 p-4 space-y-4">
												<div className="flex flex-wrap gap-2">
													<Button>Default</Button>
													<Button variant="secondary">Secondary</Button>
													<Button variant="outline">Outline</Button>
													<Button variant="ghost">Ghost</Button>
													<Button variant="link">Link</Button>
													<Button variant="destructive">Destructive</Button>
												</div>
												<div className="flex flex-wrap items-center gap-2 border-t border-foreground/5 pt-4">
													<Button size="sm">Small</Button>
													<Button>Default</Button>
													<Button size="lg">Large</Button>
													<Button size="icon" aria-label="icon">
														<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
															<path d="M5 12h14M12 5v14" strokeLinecap="round" />
														</svg>
													</Button>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Inputs</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">Sharp, minimal affordances.</p>
											</div>
											<div className="border border-foreground/10 p-4 grid sm:grid-cols-2 gap-3">
												<label className="flex flex-col gap-1.5">
													<span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">Email</span>
													<Input type="email" placeholder="you@better-auth.com" />
												</label>
												<label className="flex flex-col gap-1.5">
													<span className="text-[11px] font-mono uppercase tracking-wider text-foreground/50">Password</span>
													<Input type="password" placeholder="••••••••" />
												</label>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Card</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">Flat border, no shadow. Uses dashed footer rules for meta.</p>
											</div>
											<div className="grid sm:grid-cols-2 gap-3">
												<Card>
													<Card.Header>
														<Card.Title>Session</Card.Title>
														<Card.Description>The canonical unit of auth state on every request.</Card.Description>
													</Card.Header>
													<Card.Content>
														<p className="text-sm text-foreground/70">Cookies, JWTs, or both — configured per deployment.</p>
													</Card.Content>
													<Card.Footer>
														<span className="text-[11px] font-mono text-foreground/50">v1.4.0</span>
													</Card.Footer>
												</Card>
												<Card>
													<Card.Header>
														<Card.Title>Plugin</Card.Title>
														<Card.Description>Opt-in capability — organizations, 2FA, magic links.</Card.Description>
													</Card.Header>
													<Card.Content>
														<p className="text-sm text-foreground/70">Each plugin ships its own schema, routes, and client helpers.</p>
													</Card.Content>
													<Card.Footer>
														<span className="text-[11px] font-mono text-foreground/50">30+ plugins</span>
													</Card.Footer>
												</Card>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Callouts</h3>
											</div>
											<div className="space-y-2">
												<Callout type="info" title="Heads up">Callouts use a dashed left stripe sized to the accent type.</Callout>
												<Callout type="warn" title="Careful">This action rotates signing keys and invalidates every active session.</Callout>
												<Callout type="error" title="Broken">The database adapter returned an unexpected shape.</Callout>
												<Callout type="success" title="Nice">Your provider connected and synced successfully.</Callout>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Tabs</h3>
											</div>
											<div className="border border-foreground/10 p-4">
												<Tabs defaultValue="ts" className="w-full">
													<Tabs.List>
														<Tabs.Trigger value="ts">TypeScript</Tabs.Trigger>
														<Tabs.Trigger value="js">JavaScript</Tabs.Trigger>
														<Tabs.Trigger value="sh">Shell</Tabs.Trigger>
													</Tabs.List>
													<Tabs.Content value="ts">
														<pre className="mt-3 font-mono text-xs p-3 bg-foreground/[0.03] border border-foreground/10 overflow-x-auto">
															<code>{`import { betterAuth } from "better-auth";\n\nexport const auth = betterAuth({ secret: process.env.AUTH_SECRET });`}</code>
														</pre>
													</Tabs.Content>
													<Tabs.Content value="js">
														<pre className="mt-3 font-mono text-xs p-3 bg-foreground/[0.03] border border-foreground/10 overflow-x-auto">
															<code>{`const { betterAuth } = require("better-auth");\n\nmodule.exports.auth = betterAuth({ secret: process.env.AUTH_SECRET });`}</code>
														</pre>
													</Tabs.Content>
													<Tabs.Content value="sh">
														<pre className="mt-3 font-mono text-xs p-3 bg-foreground/[0.03] border border-foreground/10 overflow-x-auto">
															<code>pnpm add better-auth</code>
														</pre>
													</Tabs.Content>
												</Tabs>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Badges</h3>
											</div>
											<div className="border border-foreground/10 p-4 flex flex-wrap gap-2">
												<Badge>default</Badge>
												<Badge variant="secondary">secondary</Badge>
												<Badge variant="destructive">destructive</Badge>
												<Badge variant="outline">outline</Badge>
											</div>
										</div>

										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Alerts</h3>
											</div>
											<div className="space-y-3">
												<Alert>
													<Alert.Title>Auth secret updated</Alert.Title>
													<Alert.Description>Existing sessions remain valid until their next refresh.</Alert.Description>
												</Alert>
												<Alert variant="destructive">
													<Alert.Title>Sign-in failed</Alert.Title>
													<Alert.Description>The provider returned an invalid ID token.</Alert.Description>
												</Alert>
											</div>
										</div>
									</div>
								</section>

								<section id="logo" className="scroll-mt-24 space-y-8">
									<div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
										<h2 className="text-lg md:text-xl tracking-tight">Logo</h2>
										<span className="text-[11px] font-mono text-foreground/40">04</span>
									</div>
									<div className="space-y-10">
										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Logo</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													Use the mark at 24px minimum. Prefer the wordmark when the brand needs to read at a distance.
												</p>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
												{[
													{ label: "Mark Light", src: assets.mark.light.svg, bg: "bg-neutral-50" },
													{ label: "Mark Dark", src: assets.mark.dark.svg, bg: "bg-neutral-950 text-white" },
													{ label: "Wordmark Light", src: assets.wordmark.light.svg, bg: "bg-neutral-50" },
													{ label: "Wordmark Dark", src: assets.wordmark.dark.svg, bg: "bg-neutral-950 text-white" },
												].map((logo) => (
													<a key={logo.src} href={logo.src} download className="border border-foreground/10 group">
														<div className={`h-28 w-full flex items-center justify-center p-6 ${logo.bg}`}>
															<Image src={logo.src} alt={logo.label} width={120} height={60} className="max-h-12 w-auto max-w-full" />
														</div>
														<div className="flex items-baseline justify-between border-t border-foreground/10 px-3 py-2">
															<p className="text-[11px] font-medium">{logo.label}</p>
															<span className="text-[10px] font-mono text-foreground/50 group-hover:text-foreground/90 transition-colors">.svg ↓</span>
														</div>
													</a>
												))}
											</div>
										</div>
									</div>
								</section>

								<section id="voice" className="scroll-mt-24 space-y-8">
									<div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
										<h2 className="text-lg md:text-xl tracking-tight">Voice</h2>
										<span className="text-[11px] font-mono text-foreground/40">05</span>
									</div>
									<div className="space-y-10">
										<div className="space-y-4">
											<div className="space-y-1">
												<h3 className="text-sm font-medium">Voice</h3>
												<p className="text-[13px] text-foreground/50 leading-relaxed max-w-prose">
													How Better Auth communicates — across docs, product copy, and marketing.
												</p>
											</div>
											<div className="grid sm:grid-cols-2 gap-3">
												{[
													{ title: "Clear over clever", body: "We name things what they are. Session, key, secret — not SessionManagerV2Provider." },
													{ title: "Terse, but warm", body: "Short sentences. No marketing fluff. Sound like a thoughtful engineer, not a billboard." },
													{ title: "Show the code", body: "A well-named snippet does more than a paragraph. Prose sets canvas; code proves it." },
													{ title: "Sharp, not loud", body: "Minimal radii, dashed dividers, mono for metadata. The design should feel precise, never decorative." },
												].map((item) => (
													<div key={item.title} className="border border-foreground/10 p-4">
														<p className="text-sm font-medium">{item.title}</p>
														<p className="text-sm text-foreground/60 leading-relaxed mt-1">{item.body}</p>
													</div>
												))}
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		</div>
	);
}