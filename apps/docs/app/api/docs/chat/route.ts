import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import * as zod from "zod";
import { source } from "@/lib/source";

const router = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const model = router.chat("nvidia/nemotron-3-ultra-550b-a55b:free");

let index: string | null = null;

export async function POST(request: Request) {
	try {
		if (process.env.NODE_ENV === "production") {
			const response = await fetch(
				`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
					},
					body: JSON.stringify(
						((ip) => [
							[
								"ZADD",
								`chat-limit:${ip}`,
								"NX",
								Date.now(),
								crypto.randomUUID(),
							],
							["ZREMRANGEBYSCORE", `chat-limit:${ip}`, 0, Date.now() - 3600000],
							["ZCARD", `chat-limit:${ip}`],
						])(
							request.headers.get("x-real-ip")?.trim() ||
								request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
								"unknown",
						),
					),
				},
			);
			if (response.ok && ((await response.json())[2]?.result ?? 0) > 5) {
				return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
					status: 429,
				});
			}
		}

		const body = await request.json().catch(() => null);
		if (
			!Array.isArray(body?.messages) ||
			!body.messages.length ||
			body.messages.length > 100
		) {
			return new Response(JSON.stringify({ error: "Invalid request." }), {
				status: 400,
			});
		}

		if (!index) {
			const lines: string[] = [];
			for (const page of source.getPages()) {
				if (page.slugs[0] === "openapi") continue;
				lines.push(
					`* ${page.data.title} [${page.slugs.join("/")}]${page.data.description ? ` ${page.data.description}` : ""}`,
				);
			}
			index = lines.join("\n");
		}

		return streamText({
			model,
			maxOutputTokens: 2048,
			system: `You are a documentation assistant for Better Auth. Answer user questions accurately using available documentation tools. 
            
            Rules:
            1. Use getDocumentation to read the exact text of a page before answering if details are missing.
            2. Use searchCode or getFileContent for source code details.
            3. Be exact with APIs and configurations.
            4. Use standard markdown. Write code examples in clean snippets.
            5. Max length is under 400 words.
            
            Available Slugs:
            \n${index}`,
			messages: await convertToModelMessages(body.messages, {
				ignoreIncompleteToolCalls: true,
			}),
			tools: {
				getDocumentation: tool({
					description:
						"Retrieve full text of documentation page based on a slug from the system prompt list.",
					inputSchema: zod.object({ slug: zod.string() }),
					execute: async ({ slug }) => {
						const page = source.getPage(slug.split("/"));
						if (!page) return { error: "Page not found." };
						try {
							const content = await (page.data as any).getText("processed");
							return { content };
						} catch {
							return { error: "Failed to load page." };
						}
					},
				}),
				searchCode: tool({
					description: "Search GitHub source code.",
					inputSchema: zod.object({
						query: zod.string(),
						path: zod.string().optional(),
					}),
					execute: async ({ query, path }) => {
						const url = new URL("https://api.github.com/search/code");
						url.searchParams.set(
							"q",
							`${query} repo:prostha/runtime${path ? ` path:${path}` : ""}`,
						);
						url.searchParams.set("per_page", "8");

						const response = await fetch(url.toString(), {
							headers: {
								Accept: "application/vnd.github.text-match+json",
								"X-GitHub-Api-Version": "2022-11-28",
								...(process.env.GITHUB_TOKEN
									? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
									: {}),
							},
						});
						if (!response.ok)
							return { error: "GitHub search is temporarily unavailable." };

						return {
							results: ((await response.json()).items ?? []).map(
								(item: any) => ({
									path: item.path,
									url: item.html_url,
									fragments: (item.text_matches ?? []).map(
										(match: any) => match.fragment,
									),
								}),
							),
						};
					},
				}),
				getFileContent: tool({
					description: "Fetch source file content from repository.",
					inputSchema: zod.object({ path: zod.string() }),
					execute: async ({ path }) => {
						const response = await fetch(
							`https://api.github.com/repos/prostha/docs/contents/${encodeURIComponent(path)}?ref=main`,
							{
								headers: {
									Accept: "application/vnd.github.raw+json",
									"X-GitHub-Api-Version": "2022-11-28",
									...(process.env.GITHUB_TOKEN
										? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
										: {}),
								},
							},
						);
						if (!response.ok)
							return { error: "Unable to fetch that file right now." };

						const text = await response.text();
						return {
							path,
							content:
								text.length > 12000
									? `${text.slice(0, 12000)}\n\n... (truncated)`
									: text,
						};
					},
				}),
			},
			stopWhen: stepCountIs(8),
		}).toUIMessageStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Something went wrong." }), {
			status: 500,
		});
	}
}
