import "dotenv/config";
import * as fs from "node:fs";
import { Client } from "typesense";
import type { DocumentRecord } from "typesense-fumadocs-adapter";
import { sync } from "typesense-fumadocs-adapter";

if (!process.env.NEXT_PUBLIC_TYPESENSE_SERVER_URL || !process.env.TYPESENSE_ADMIN_API_KEY) {
	console.log("Required environment variables are missing. Synchronization aborted.");
	process.exit(0);
}

if (!process.env.VERCEL) {
	console.log("Execution context is not Vercel. Synchronization aborted.");
	process.exit(0);
}

if (!process.env.VERCEL_ENV) {
	console.log("Vercel environment metadata is missing. Synchronization aborted.");
	process.exit(0);
}

if (process.env.VERCEL_ENV !== "production") {
	console.log(`Skipping synchronization for non-production environment: "${process.env.VERCEL_ENV}".`);
	process.exit(0);
}

if (process.env.VERCEL_GIT_COMMIT_REF !== "main") {
	console.log(`Skipping synchronization for non-main branch: "${process.env.VERCEL_GIT_COMMIT_REF}".`);
	process.exit(0);
}

if (import.meta.main) {
	const path = ".next/server/app/api/docs/static.json.body";
	if (!fs.existsSync(path)) {
		console.warn(`Build artifact not found at "${path}". Synchronization aborted.`);
		process.exit(0);
	}

	try {
		const url = new URL(process.env.NEXT_PUBLIC_TYPESENSE_SERVER_URL);
		const content = fs.readFileSync(path, "utf8");
		const records = JSON.parse(content) as DocumentRecord[];

		const client = new Client({
			nodes: [
				{
					host: url.hostname,
					port: Number(url.port) || (url.protocol === "https:" ? 443 : 80),
					protocol: url.protocol.replace(":", ""),
				},
			],
			apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
			connectionTimeoutSeconds: 30,
		});

		await sync(client, {
			typesenseCollectionName: "prostha-docs",
			documents: records,
		});

		console.log(`Search index successfully updated. Synchronized ${records.length} records.`);
	} catch (error) {
		console.error("Failed to synchronize search index. Proceeding with build process.", error);
	}
}