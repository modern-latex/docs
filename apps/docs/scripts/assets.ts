/**
 * Puts mLaTeX's WebAssembly build and pdf.js's worker in public/latex, for the
 * reference's examples to be set and drawn in the browser:
 * node scripts/assets.ts [folder holding mlatex.js, mlatex.wasm and mlatex.data]
 *
 * The build is the folder named, or MLATEX_WASM's, or else the mlatex
 * package's. A release before 0.1.3 names its files latex.js, latex.wasm and
 * latex.data; they are copied under mlatex's names all the same.
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

const target = join(import.meta.dirname, "..", "public", "latex");
mkdirSync(target, { recursive: true });

const require = createRequire(import.meta.url);
copyFileSync(
	require.resolve("pdfjs-dist/build/pdf.worker.min.mjs"),
	join(target, "pdf.worker.min.mjs"),
);

let source = process.argv[2] || process.env.MLATEX_WASM;
if (!source) {
	try {
		source = dirname(require.resolve("mlatex/package.json"));
	} catch {
		source = undefined;
	}
}
const prefix =
	source &&
	["mlatex", "latex"].find((name) => existsSync(join(source, `${name}.js`)));
if (source && prefix) {
	for (const ending of ["js", "wasm", "data"]) {
		// A file the same as the one there is left alone, so the fonts below
		// aren't compressed again when nothing changed.
		const from = join(source, `${prefix}.${ending}`);
		const to = join(target, `mlatex.${ending}`);
		if (!existsSync(to) || !readFileSync(from).equals(readFileSync(to))) {
			copyFileSync(from, to);
		}
	}
	console.log(`Copied mLaTeX from ${source}`);
} else if (!existsSync(join(target, "mlatex.js"))) {
	console.warn(
		"mLaTeX is missing, so the reference's examples won't be drawn: install the mlatex package, or run `pnpm assets <folder holding mlatex.js, mlatex.wasm and mlatex.data>`.",
	);
}

// Beside the build, the faces mLaTeX lends a page for a script or symbols it
// carries none of -- Chinese, Thai, emoji -- and fonts.json, which says what
// each draws: the worker fetches one only when an example needs it.
const lent = source && join(source, "fallback");
if (lent && existsSync(lent)) {
	mkdirSync(join(target, "fallback"), { recursive: true });
	for (const name of readdirSync(lent)) {
		const from = join(lent, name);
		const to = join(target, "fallback", name);
		if (!existsSync(to) || !readFileSync(from).equals(readFileSync(to))) {
			copyFileSync(from, to);
		}
	}
}

// The fonts, 36 MB and the lent faces beside them, go out compressed as
// brotli, which the browser undoes itself: once for each build of mLaTeX,
// and best for a build for production.
const best = process.env.npm_lifecycle_event === "prebuild";
for (const file of [
	join(target, "mlatex.data"),
	...(existsSync(join(target, "fallback"))
		? readdirSync(join(target, "fallback"))
				.filter((name) => /\.(otf|ttf)$/.test(name))
				.map((name) => join(target, "fallback", name))
		: []),
]) {
	const packed = `${file}.br`;
	if (
		!existsSync(file) ||
		(existsSync(packed) && statSync(packed).mtimeMs >= statSync(file).mtimeMs)
	) {
		continue;
	}
	const raw = readFileSync(file);
	writeFileSync(
		packed,
		brotliCompressSync(raw, {
			params: {
				[constants.BROTLI_PARAM_QUALITY]: best ? 11 : 9,
				[constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
			},
		}),
	);
	console.log(
		`Compressed ${basename(file)}, ${(raw.length / 1e6).toFixed(1)} MB to ${(statSync(packed).size / 1e6).toFixed(1)} MB`,
	);
}
