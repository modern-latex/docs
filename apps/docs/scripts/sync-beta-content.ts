import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

if (process.env.BETA_DOCS_SKIP === "1") {
	console.log("Beta documentation synchronization skipped via environment configuration.");
	process.exit(0);
}

function git(args: string[], dir?: string) {
	execFileSync("git", args, { stdio: "inherit", cwd: dir });
}

console.log(`Initiating synchronization of beta documentation from remote branch "${process.env.BETA_DOCS_BRANCH ?? "main"}" to destination "content/docs-beta".`);

try {
	rmSync(".beta-sync-tmp", { recursive: true, force: true });

	git([
		"clone",
		"--depth=1",
		`--branch=${process.env.BETA_DOCS_BRANCH ?? "main"}`,
		"--filter=blob:none",
		"--sparse",
		process.env.BETA_DOCS_REPO ?? "https://github.com/prostha/docs.git",
		".beta-sync-tmp",
	]);
	git(["-C", ".beta-sync-tmp", "sparse-checkout", "set", "apps/docs/content/docs"]);

	const source = join(".beta-sync-tmp", "apps/docs/content/docs");
	if (!existsSync(source)) {
		throw new Error(`Verification failed: Source path not found after sparse checkout at "${source}".`);
	}

	rmSync("content/docs-beta", { recursive: true, force: true });
	cpSync(source, "content/docs-beta", { recursive: true });
	writeFileSync(join("content/docs-beta", ".gitkeep"), "");

	console.log("Beta documentation synchronization completed successfully.");
} finally {
	rmSync(".beta-sync-tmp", { recursive: true, force: true });
}