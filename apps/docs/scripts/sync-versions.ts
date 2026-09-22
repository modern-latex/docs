import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { archived, versions } from "../lib/versions.ts";

// Copies the pages of every version other than the latest from its branch of
// the docs repository: the beta's into content/docs-beta, and each earlier
// version's into content/docs-archive under its number, as /docs/0.1 serves.

if (process.env.BETA_DOCS_SKIP === "1") {
	console.log("Version synchronization skipped via environment configuration.");
	process.exit(0);
}

const repository =
	process.env.BETA_DOCS_REPO ?? "https://github.com/modern-latex/docs.git";

function git(args: string[]) {
	execFileSync("git", args, { stdio: "inherit" });
}

/** Copies the pages on one branch to a folder, replacing what was there. */
function sync(branch: string, destination: string) {
	console.log(
		`Synchronizing documentation from branch "${branch}" to "${destination}".`,
	);
	const temporary = ".versions-sync-tmp";
	try {
		rmSync(temporary, { recursive: true, force: true });
		git([
			"clone",
			"--depth=1",
			`--branch=${branch}`,
			"--filter=blob:none",
			"--sparse",
			repository,
			temporary,
		]);
		git(["-C", temporary, "sparse-checkout", "set", "apps/docs/content/docs"]);
		const source = join(temporary, "apps/docs/content/docs");
		if (!existsSync(source)) {
			throw new Error(
				`Verification failed: Source path not found after sparse checkout at "${source}".`,
			);
		}
		rmSync(destination, { recursive: true, force: true });
		cpSync(source, destination, { recursive: true });
	} finally {
		rmSync(temporary, { recursive: true, force: true });
	}
}

sync(process.env.BETA_DOCS_BRANCH ?? "main", "content/docs-beta");
writeFileSync(join("content/docs-beta", ".gitkeep"), "");

rmSync("content/docs-archive", { recursive: true, force: true });
mkdirSync("content/docs-archive", { recursive: true });
writeFileSync(join("content/docs-archive", ".gitkeep"), "");
for (const version of versions.filter(archived)) {
	sync(version.branch, join("content/docs-archive", version.slug!));
}

console.log("Version synchronization completed successfully.");
