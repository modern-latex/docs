// mLaTeX's WebAssembly module, run off the page's thread, setting the
// reference's examples with Session.snippet. The module finds mlatex.wasm and
// its fonts in mlatex.data beside this file, the fonts compressed as
// mlatex.data.br. Each is asked for with the build's fingerprint the page
// gives this file, so the browser keeps them until a new build.
const version = new URL(self.location.href).search;

importScripts(`mlatex.js${version}`);

let session;
let ready;

// Each example's pages, by the example's id, as mLaTeX's Screen: drawn onto a
// canvas by mLaTeX itself at whatever size the page shows them, until the page
// lets them go. A build of mLaTeX before Screen keeps none, and the page draws
// the PDF with pdf.js instead.
const screens = new Map();

/** Loads mLaTeX afresh: at first, and again after it aborts, which leaves it unusable. */
function start() {
	session = undefined;
	// The pages belonged to the module that aborted.
	screens.clear();
	// A release before 0.1.3 names its factory Latex.
	ready = (self.mLatex ?? self.Latex)({
		locateFile: (path) =>
			`${path.endsWith(".data") ? "mlatex.data.br" : path.endsWith(".wasm") ? "mlatex.wasm" : path}${version}`,
	}).then((module) => {
		session = new module.Session();
	});
}
start();

/**
 * Sets one example, cropped when it can be and as the whole document when
 * not, and keeps its pages to draw from by the example's id.
 */
async function run(id, source) {
	await ready;
	const begin = performance.now();
	let clean = false;
	let cropped = false;
	// An article is set as its preamble and body alone, without its class and
	// its document environment, on a page cropped to it.
	if (/^\s*\\documentclass\{article\}\s*$/m.test(source)) {
		clean = session.snippet(
			source
				.split("\n")
				.filter(
					(line) =>
						!/^\s*\\documentclass\b/.test(line) &&
						!/^\s*\\(begin|end)\{document\}\s*$/.test(line),
				)
				.join("\n"),
		);
		// A footnote or a float at the foot of the page, or a piece that draws
		// nothing, leaves the cropped page as large as the page it was cut
		// from -- larger than US Letter, 612 by 792 points -- and the whole
		// document shows it as it is set instead.
		const box =
			/\/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/.exec(
				new TextDecoder("latin1").decode(session.pdf()),
			);
		cropped =
			clean && box !== null && box[3] - box[1] <= 612 && box[4] - box[2] <= 792;
	}
	// snippet reads a document of its own class as that class's document.
	if (!cropped) clean = session.snippet(source);
	const time = performance.now() - begin;
	const pdf = session.pdf();
	let sizes = null;
	if (typeof session.screen === "function" && pdf.length) {
		const screen = session.screen();
		screens.set(id, screen);
		sizes = [];
		for (let page = 0; page < screen.count(); page++) {
			sizes.push({ width: screen.width(page), height: screen.height(page) });
		}
	}
	return { clean, pdf, sizes, log: session.error(), cropped, time };
}

// One thing at a time: an abort replaces the module, and one waiting on the
// old module would otherwise reach for a session that is gone.
let queue = Promise.resolve();
self.onmessage = ({ data }) => {
	if (data.kind === "release") {
		// The page can no longer draw these pages.
		screens.get(data.setting)?.delete();
		screens.delete(data.setting);
		return;
	}
	queue = queue.then(async () => {
		if (data.kind === "draw") {
			// A page of an example onto white, at so many pixels to the point.
			const screen = screens.get(data.setting);
			let image = null;
			try {
				if (screen && data.page < screen.count()) {
					const canvas = new OffscreenCanvas(
						Math.max(1, Math.floor(screen.width(data.page) * data.scale)),
						Math.max(1, Math.floor(screen.height(data.page) * data.scale)),
					);
					const context = canvas.getContext("2d");
					context.fillStyle = "#fff";
					context.fillRect(0, 0, canvas.width, canvas.height);
					screen.draw(context, data.page, data.scale);
					image = canvas.transferToImageBitmap();
				}
			} catch {
				image = null;
			}
			self.postMessage({ id: data.id, image }, image ? [image] : []);
			return;
		}
		try {
			const outcome = await run(data.id, data.source);
			self.postMessage({ id: data.id, ...outcome, failure: "" }, [
				outcome.pdf.buffer,
			]);
		} catch (failure) {
			start();
			self.postMessage({
				id: data.id,
				clean: false,
				pdf: new Uint8Array(),
				sizes: null,
				log: "",
				cropped: false,
				time: 0,
				failure: String(failure?.message ?? failure).replace(
					" Build with -sASSERTIONS for more info.",
					"",
				),
			});
		}
	});
};
