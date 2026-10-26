// mLaTeX's WebAssembly module, run off the page's thread, setting the
// reference's examples with Session.snippet. The module finds mlatex.wasm and
// its fonts in mlatex.data beside this file, the fonts compressed as
// mlatex.data.br. Each is asked for with the build's fingerprint the page
// gives this file, so the browser keeps them until a new build.
const version = new URL(self.location.href).search;

importScripts(`mlatex.js${version}`);

// A release before 0.1.3 names its factory Latex.
const factory = self.mLatex ?? self.Latex;

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
	ready = factory({
		locateFile: (path) =>
			`${path.endsWith(".data") ? "mlatex.data.br" : path.endsWith(".wasm") ? "mlatex.wasm" : path}${version}`,
	}).then((module) => {
		session = new module.Session();
	});
	return ready;
}
start();

// A US Letter page, in points: the largest a piece of an article sets on
// when it is cropped to what it holds.
const letter = { width: 612, height: 792 };

/** The first page's width and height in points, from its MediaBox. */
function measure(pdf) {
	const text = new TextDecoder("latin1").decode(pdf);
	const box =
		/\/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\]/.exec(
			text,
		);
	if (!box) return null;
	const [left, bottom, right, top] = box.slice(1).map(Number);
	return { width: right - left, height: top - bottom };
}

/**
 * An article's preamble and body, without its class and its document
 * environment, for snippet to set on a page cropped to it; null for a
 * document of another class or with options, whose class makes the page.
 */
function piece(source) {
	if (!/^\s*\\documentclass\{article\}\s*$/m.test(source)) return null;
	return source
		.split("\n")
		.filter(
			(line) =>
				!/^\s*\\documentclass\b/.test(line) &&
				!/^\s*\\(begin|end)\{document\}\s*$/.test(line),
		)
		.join("\n");
}

/**
 * What the session last set: whether cleanly, its PDF, its log, and its
 * pages' sizes, which are kept to draw from when mLaTeX can draw them.
 */
function settle(id, clean, cropped, begin) {
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

/** Sets one example: cropped when it can be, and as the whole document when not. */
async function run(id, source) {
	await ready;
	const begin = performance.now();
	const cut = piece(source);
	if (cut !== null) {
		const clean = session.snippet(cut);
		const pdf = session.pdf();
		const size = pdf.length ? measure(pdf) : null;
		// A footnote or a float at the foot of the page, or a piece that
		// draws nothing, leaves the cropped page as tall as the page it was
		// cut from: the whole document shows it as it is set.
		if (
			clean &&
			size &&
			size.width <= letter.width &&
			size.height <= letter.height
		) {
			return settle(id, clean, true, begin);
		}
	}
	// snippet reads a document of its own class as that class's document.
	const clean = session.snippet(source);
	return settle(id, clean, false, begin);
}

/** Draws a page of an example onto white, at so many pixels to the point, for the page to show. */
function draw({ id, setting, page, scale }) {
	const screen = screens.get(setting);
	let image = null;
	try {
		if (screen && page < screen.count()) {
			const canvas = new OffscreenCanvas(
				Math.max(1, Math.floor(screen.width(page) * scale)),
				Math.max(1, Math.floor(screen.height(page) * scale)),
			);
			const context = canvas.getContext("2d");
			context.fillStyle = "#fff";
			context.fillRect(0, 0, canvas.width, canvas.height);
			screen.draw(context, page, scale);
			image = canvas.transferToImageBitmap();
		}
	} catch {
		image = null;
	}
	self.postMessage({ kind: "drawn", id, image }, image ? [image] : []);
}

// One thing at a time: an abort replaces the module, and one waiting on the
// old module would otherwise reach for a session that is gone.
let queue = Promise.resolve();
self.onmessage = (event) => {
	const { data } = event;
	if (data.kind === "release") {
		// The page can no longer draw these pages.
		screens.get(data.setting)?.delete();
		screens.delete(data.setting);
		return;
	}
	queue = queue.then(() => (data.kind === "draw" ? draw(data) : set(data)));
};

async function set({ id, source }) {
	try {
		const outcome = await run(id, source);
		self.postMessage({ id, ...outcome, failure: "" }, [outcome.pdf.buffer]);
	} catch (failure) {
		start();
		self.postMessage({
			id,
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
}
