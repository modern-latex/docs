import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createMDX } from "fumadocs-mdx/next";

/**
 * mLaTeX's build in public/latex, as a short fingerprint. The reference's
 * examples ask for its files with it, so a browser keeps them for good and
 * only fetches them again when a new build changes it.
 */
const engine = createHash("sha256");
for (const name of ["mlatex.js", "mlatex.wasm", "mlatex.data"]) {
	const file = join(process.cwd(), "public", "latex", name);
	if (existsSync(file)) engine.update(readFileSync(file));
}

// Kept for good only in production; while trying things out a build of mLaTeX may be swapped under a running server.
const lasting =
	process.env.NODE_ENV === "production"
		? [
				{
					key: "Cache-Control",
					value: "public, max-age=31536000, immutable",
				},
			]
		: [];

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@mlatex/ui"],
	env: {
		MLATEX_VERSION: engine.digest("hex").slice(0, 12),
	},
	async headers() {
		return [
			{
				source: "/latex/:name(mlatex\\.js|mlatex\\.wasm)",
				headers: lasting,
			},
			// The fonts are sent as compressed by scripts/assets.ts, for the browser to undo.
			{
				source: "/latex/mlatex.data.br",
				headers: [
					{ key: "Content-Encoding", value: "br" },
					{ key: "Content-Type", value: "application/octet-stream" },
					...lasting,
				],
			},
		].filter((rule) => rule.headers.length);
	},
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
			"@radix-ui/react-tabs",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-popover",
			"@radix-ui/react-select",
			"@radix-ui/react-checkbox",
		],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	async redirects() {
		return [
			// Infrastructure backwards compatibility redirects
			{
				source: "/dashboard/:path*",
				destination: "https://dash.better-auth.com",
				permanent: true,
			},
			{
				source: "/docs",
				destination: "/docs/introduction",
				permanent: false,
			},
			// Legacy query string based redirects
			{
				source: "/products",
				has: [{ type: "query", key: "tab", value: "framework" }],
				destination: "/products/framework",
				permanent: true,
			},
			{
				source: "/products",
				has: [{ type: "query", key: "tab", value: "infrastructure" }],
				destination: "/products/infrastructure",
				permanent: true,
			},
			{
				source: "/terms",
				destination: "/legal/terms",
				permanent: true,
			},
			{
				source: "/privacy",
				destination: "/legal/privacy",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/ask-ai",
				destination: "/docs/ai-resources",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/llms-txt",
				destination: "/llms.txt",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/:path*",
				destination: "/docs/ai-resources/:path*",
				permanent: true,
			},
		];
	},
};

const withMDX = createMDX({
	contentDirBasePath: "/content/docs",
});
export default withMDX(nextConfig);
