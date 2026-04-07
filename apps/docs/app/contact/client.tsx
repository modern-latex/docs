"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Footer from "@/components/landing/footer";
import { HalftoneBackground } from "@/components/landing/halftone-bg";
import { Form } from "@prostha/ui/src/components/form";
import { Button } from "@prostha/ui/src/components/button";
import { Input } from "@prostha/ui/src/components/input";
import { Textarea } from "@prostha/ui/src/components/textarea";
import { schema } from "@/lib/contact";

export function Contact() {
	const reference = useRef<HTMLInputElement>(null);
	const [notification, setNotification] = useState<string | null>(null);

	const form = useForm<zod.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: "",
			email: "",
			description: "",
		},
	});

	useEffect(() => {
		if (!notification) return;
		const timer = setTimeout(() => setNotification(null), 1200);
		return () => clearTimeout(timer);
	}, [notification]);

	return (
		<div className="relative min-h-dvh pt-14 lg:pt-0">
			<div className="relative text-foreground">
				<div className="flex flex-col lg:flex-row">

					<aside className="hidden lg:block relative w-full shrink-0 lg:w-[30%] lg:h-dvh border-b lg:border-b-0 lg:border-r border-foreground/6 overflow-clip px-5 sm:px-6 lg:px-10 lg:sticky lg:top-0">
						<div className="absolute inset-0 pointer-events-none">
							<HalftoneBackground />
						</div>
						<div className="relative w-full pt-6 md:pt-10 pb-6 lg:pb-0 flex flex-col justify-center lg:h-full">
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="space-y-6"
							>
								<div className="space-y-2">
									<h1 className="text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight">
										Own your auth
										<br />
										<span className="text-neutral-500 dark:text-neutral-400">
											at scale.
										</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed max-w-[260px]">
										Keep your users on your own infrastructure with enterprise-grade
										auth, SSO, RBAC, and dedicated support.
									</p>
								</div>
								<div className="flex items-center gap-3 pt-1">
									<Link
										href="/pricing"
										className="inline-flex items-center gap-1.5 text-[12px] text-foreground/60 hover:text-foreground/80 font-mono uppercase tracking-wider transition-colors"
									>
										View Pricing
										<svg className="h-2.5 w-2.5 opacity-50" viewBox="0 0 10 10" fill="none">
											<path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" />
										</svg>
									</Link>
								</div>
							</motion.div>
						</div>
					</aside>

					<div className="relative w-full lg:w-[70%] overflow-x-hidden no-scrollbar flex flex-col min-h-dvh">
						<div className="px-5 sm:px-6 lg:px-10 lg:pt-16 pb-10 space-y-8 flex-1">

							<div className="lg:hidden relative border-b border-foreground/6 overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6 mb-5">
								<div className="absolute inset-0 pointer-events-none">
									<HalftoneBackground />
								</div>
								<div className="relative space-y-2 py-16">
									<h1 className="text-2xl md:text-3xl xl:text-4xl text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight">
										Own your auth
										<br />
										<span className="text-neutral-500 dark:text-neutral-400">
											at scale.
										</span>
									</h1>
									<p className="text-sm text-foreground/70 dark:text-foreground/50 leading-relaxed">
										Keep your users on your own infrastructure with
										enterprise-grade auth, SSO, RBAC, and dedicated support.
									</p>
								</div>
							</div>

							<h2 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-5">
								GET IN TOUCH
								<span className="flex-1 h-px bg-foreground/15" />
							</h2>

							<motion.div
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.05 }}
							>
								<div className="relative overflow-hidden max-w-xl lg:mt-8">
									<div className="py-4 sm:py-5">
										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(async (values) => {
													try {
														const response = await fetch("/api/contact", {
															method: "POST",
															body: JSON.stringify({
																...values,
																reference: reference.current?.value,
															}),
															headers: {
																"Content-Type": "application/json",
															},
														});
														if (!response.ok) {
															const { message } = await response.json();
															if (response.status === 422) {
																form.setError("email", { message });
																return;
															}
															toast.error(message || "Something went wrong. Please try again.");
															return;
														}
														toast.success("Thank you for your interest! We'll be in touch soon.");
														form.reset();
													} catch {
														toast.error("Something went wrong. Please try again.");
													}
												})}
												className="space-y-3.5"
											>
												<div aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
													<input ref={reference} type="text" tabIndex={-1} autoComplete="off" />
												</div>

												{[
													{ name: "fullName", label: "Full Name", placeholder: "Your name" },
													{ name: "email", label: "Email", placeholder: "name@example.com", type: "email" }
												].map((element) => (
													<Form.Field
														key={element.name}
														control={form.control}
														name={element.name as "fullName" | "email"}
														render={({ field }) => (
															<Form.Item>
																<Form.Label className="text-xs tracking-wider text-foreground/50 font-mono">
																	{element.label}
																</Form.Label>
																<Form.Control>
																	<Input {...field} type={element.type || "text"} placeholder={element.placeholder} />
																</Form.Control>
																<Form.Message />
															</Form.Item>
														)}
													/>
												))}

												<Form.Field
													control={form.control}
													name="description"
													render={({ field }) => (
														<Form.Item>
															<Form.Label className="text-xs tracking-wider text-foreground/50 font-mono">
																What do you need help with?
															</Form.Label>
															<Form.Control>
																<Textarea
																	{...field}
																	rows={4}
																	placeholder="Tell us about your project and requirements..."
																	className="min-h-[100px]"
																/>
															</Form.Control>
															<Form.Message />
														</Form.Item>
													)}
												/>

												<Button
													disabled={form.formState.isSubmitting}
													type="submit"
													className="w-full font-mono uppercase tracking-widest"
												>
													{form.formState.isSubmitting ? "Sending..." : "Send"}
												</Button>
											</form>
										</Form>

										<p className="mt-4 text-foreground/50 text-xs leading-relaxed">
											By submitting, you agree to our{" "}
											<Link href="/legal/terms" className="underline hover:text-foreground/55">
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link href="/legal/privacy" className="underline hover:text-foreground/55">
												Privacy Policy
											</Link>
											.
										</p>
									</div>
								</div>
							</motion.div>
						</div>
						<div className="mt-auto">
							<Footer />
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}