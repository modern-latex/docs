"use client";

import type { ComponentProps, ReactNode } from "react";
import {
	createContext,
	use,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { useChat } from "@ai-sdk/react";
import { Drawer } from "@prostha/ui/src/components/drawer";
import { cn } from "@prostha/ui/src/lib/utils";
import { DefaultChatTransport } from "ai";
import { Loader2, MessageCircleIcon, Send, X } from "lucide-react";

import { Feedback } from "@/components/feedback";
import { Markdown } from "@/components/markdown";

const Context = createContext<{
	open: boolean;
	setOpen: (open: boolean) => void;
	chat: ReturnType<typeof useChat>;
} | null>(null);

export function Chat({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const chat = useChat({
		id: "ai-chat",
		transport: new DefaultChatTransport({ api: "/api/docs/chat" }),
	});

	useEffect(() => {
		const show = () => setOpen(true);
		window.addEventListener("better-auth:open-ai-chat", show);

		const query = new URLSearchParams(window.location.search).get("askai");
		if (query) {
			setOpen(true);
			void chat.sendMessage({ text: query });
			const parameters = new URLSearchParams(window.location.search);
			parameters.delete("askai");
			window.history.replaceState(
				{},
				"",
				parameters.toString()
					? `${window.location.pathname}?${parameters.toString()}`
					: window.location.pathname,
			);
		}

		return () => window.removeEventListener("better-auth:open-ai-chat", show);
	}, [chat]);

	return (
		<Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
			{children}
		</Context>
	);
}

export function Trigger({ className, ...props }: ComponentProps<"button">) {
	const context = use(Context);
	if (!context) throw new Error("Missing <AIChat />");

	return (
		<button
			type="button"
			data-state={context.open ? "open" : "closed"}
			className={cn(
				"fixed bottom-5 inset-e-5 z-20 flex items-center gap-2.5 px-3.5 py-1.5 border bg-secondary/70 backdrop-blur-md shadow-lg transition-[translate,opacity]",
				context.open && "translate-y-10 opacity-0",
				className,
			)}
			onClick={() => context.setOpen(!context.open)}
			{...props}
		/>
	);
}

export function Panel() {
	const context = use(Context);
	if (!context) throw new Error("Missing <AIChat />");

	const [width, setWidth] = useState(400);
	const [dragging, setDragging] = useState(false);
	const [input, setInput] = useState("");
	const [height, setHeight] = useState(38);
	const [desktop, setDesktop] = useState(false);

	const pointer = useRef(0);
	const initial = useRef(width);
	const textarea = useRef<HTMLTextAreaElement>(null);
	const container = useRef<HTMLDivElement>(null);
	const body = useRef<HTMLDivElement>(null);
	const resizer = useRef<{ y: number; h: number } | null>(null);

	useEffect(() => {
		setDesktop(window.matchMedia("(min-width: 1024px)").matches);
		const handler = (event: KeyboardEvent) => {
			if (event.key === "Escape" && context.open) context.setOpen(false);
			if (event.key === "i" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				context.setOpen(!context.open);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [context]);

	useEffect(() => {
		if (!dragging) return;
		const move = (event: MouseEvent) =>
			setWidth(
				Math.min(
					640,
					Math.max(320, initial.current + (pointer.current - event.clientX)),
				),
			);
		const up = () => setDragging(false);
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
	}, [dragging]);

	useEffect(() => {
		if (!textarea.current) return;
		textarea.current.style.height = "auto";
		textarea.current.style.height = `${Math.min(window.innerHeight * 0.35, Math.max(textarea.current.scrollHeight, height))}px`;
	}, [height, input]);

	useEffect(() => {
		if (!body.current || !container.current) return;
		const observer = new ResizeObserver(() => {
			container.current?.scrollTo({
				top: container.current.scrollHeight,
				behavior: "instant",
			});
		});
		observer.observe(body.current);
		return () => observer.disconnect();
	}, []);

	if (!context.open) return null;

	const messages = context.chat.messages.filter(
		(message) => message.role !== "system",
	);

	const layout = (
		<>
			<div
				ref={container}
				className="overflow-y-auto overscroll-contain min-w-0 min-h-0 flex flex-col py-4 select-text flex-1"
				style={{
					maskImage:
						"linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)",
				}}
			>
				<div ref={body} className="flex flex-col px-1 gap-4">
					{messages.length === 0 ? (
						<div className="size-full flex flex-col items-center justify-center text-center gap-2 text-sm text-muted-foreground/80 py-6">
							<MessageCircleIcon
								fill="currentColor"
								stroke="none"
								className="size-5"
							/>
							<p>Start a new chat below.</p>
						</div>
					) : (
						<>
							{messages.map((message, index) => {
								let markdown =
									message.parts
										?.filter((part) => part.type === "text")
										.map((part) => part.text)
										.join("") || "";
								if ((markdown.match(/```/g) || []).length % 2 !== 0)
									markdown += "\n```";
								return (
									<div key={message.id}>
										<p
											className={cn(
												"mb-1 text-xs font-medium text-muted-foreground",
												message.role === "assistant" && "text-foreground",
											)}
										>
											{message.role === "user"
												? "You"
												: message.role === "assistant"
													? "Bot"
													: "unknown"}
										</p>
										<div className="text-sm prose prose-sm max-w-none [&_pre]:text-[11px]!">
											<Markdown text={markdown} />
										</div>
										{message.role === "assistant" &&
											message.id &&
											!(
												context.chat.status === "streaming" &&
												index === messages.length - 1
											) && <Feedback content={markdown} />}
									</div>
								);
							})}
							{(context.chat.status === "submitted" ||
								(context.chat.status === "streaming" &&
									(!messages.at(-1) ||
										messages.at(-1)?.role !== "assistant" ||
										!messages
											.at(-1)
											?.parts?.some(
												(part) => part.type === "text" && part.text,
											)))) && (
								<div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
									<Loader2 className="size-3 animate-spin" />
									<span>Looking through docs...</span>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			<div className="relative">
				{desktop && (
					<div
						onMouseDown={(event) => {
							event.preventDefault();
							resizer.current = { y: event.clientY, h: height };
							const move = (mouseEvent: MouseEvent) =>
								resizer.current &&
								setHeight(
									Math.max(
										38,
										Math.min(
											400,
											resizer.current.h +
												(resizer.current.y - mouseEvent.clientY),
										),
									),
								);
							const up = () => {
								resizer.current = null;
								document.removeEventListener("mousemove", move);
								document.removeEventListener("mouseup", up);
							};
							document.addEventListener("mousemove", move);
							document.addEventListener("mouseup", up);
						}}
						className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center justify-center w-8 h-3 cursor-row-resize group/drag"
					>
						<div className="w-8 h-0.5 rounded-full bg-foreground/20 dark:bg-white/20" />
					</div>
				)}
				<div className="rounded-xl border border-border/60 dark:border-white/8 bg-card/50 focus-within:bg-background">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							if (
								!input.trim() ||
								context.chat.status === "streaming" ||
								context.chat.status === "submitted"
							)
								return;
							void context.chat.sendMessage({ text: input });
							setInput("");
						}}
					>
						<div className="flex items-end">
							<textarea
								ref={textarea}
								value={input}
								onChange={(event) => setInput(event.target.value)}
								onKeyDown={(event) => {
									if (!event.shiftKey && event.key === "Enter") {
										event.preventDefault();
										if (
											!input.trim() ||
											context.chat.status === "streaming" ||
											context.chat.status === "submitted"
										)
											return;
										void context.chat.sendMessage({ text: input });
										setInput("");
									}
								}}
								disabled={
									context.chat.status === "streaming" ||
									context.chat.status === "submitted"
								}
								placeholder="Ask a question"
								autoFocus={desktop}
								rows={1}
								style={{ height: Math.max(height, 38) }}
								className="flex-1 resize-none text-base bg-transparent pl-3.5 pr-1.5 py-2.5 focus:outline-none lg:text-[13px]"
							/>
							<div className="shrink-0 pb-1.5 pr-1.5">
								{context.chat.status === "streaming" ||
								context.chat.status === "submitted" ? (
									<button
										type="button"
										onClick={context.chat.stop}
										className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-muted-foreground"
									>
										<Loader2 className="size-3.5 animate-spin" />
									</button>
								) : (
									<button
										type="submit"
										disabled={!input.trim()}
										className={cn(
											"inline-flex h-7 w-7 items-center justify-center rounded-full",
											input.trim()
												? "bg-foreground text-background"
												: "bg-muted text-muted-foreground",
										)}
									>
										<Send className="size-3.5" />
									</button>
								)}
							</div>
						</div>
					</form>
				</div>
				<div className="flex items-center gap-1.5 p-1 empty:hidden">
					{!(
						context.chat.status === "streaming" ||
						context.chat.status === "submitted"
					) &&
						messages.length > 0 && (
							<>
								<button
									type="button"
									className="px-2.5 py-1 text-xs border rounded-full text-muted-foreground"
									onClick={() => context.chat.regenerate()}
								>
									Retry
								</button>
								<button
									type="button"
									className="px-2.5 py-1 text-xs border rounded-full text-muted-foreground"
									onClick={() => context.chat.setMessages([])}
								>
									Clear Chat
								</button>
							</>
						)}
				</div>
			</div>
		</>
	);

	if (!desktop) {
		return (
			<Drawer open={context.open} onOpenChange={context.setOpen}>
				<Drawer.Content className="h-[85vh] max-h-[85vh]">
					<Drawer.Header className="flex flex-row items-center gap-2 border-b">
						<div className="flex-1 text-left">
							<Drawer.Title className="text-xs font-medium">
								AI Chat
							</Drawer.Title>
						</div>
						<Drawer.Close className="p-1">
							<X className="size-4" />
						</Drawer.Close>
					</Drawer.Header>
					<div className="flex flex-col flex-1 w-full min-h-0 overflow-hidden px-2 pb-3">
						{layout}
					</div>
				</Drawer.Content>
			</Drawer>
		);
	}

	return (
		<>
			<div
				className="overflow-hidden overscroll-contain z-200 bg-background text-foreground fixed top-0 inset-e-0 h-screen border-s shadow-2xl"
				style={{ width }}
			>
				<div
					className="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-foreground/10 z-10"
					onMouseDown={(event) => {
						event.preventDefault();
						pointer.current = event.clientX;
						initial.current = width;
						setDragging(true);
					}}
				/>
				<div className="flex flex-col size-full min-h-0 overflow-hidden p-3">
					<div className="flex items-center gap-2 border-b px-3 pb-3">
						<div className="flex-1">
							<p className="text-sm font-medium">AI Chat</p>
						</div>
						<button
							type="button"
							className="p-1"
							onClick={() => context.setOpen(false)}
						>
							<X className="size-4" />
						</button>
					</div>
					{layout}
				</div>
			</div>
			{dragging && <div className="fixed inset-0 z-201 cursor-col-resize" />}
		</>
	);
}
