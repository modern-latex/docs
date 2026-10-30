let worker: Worker | undefined;
let count = 0;
// What each message to the worker waits on, by its id: an example set, or a page of one drawn.
const waiting = new Map<number, (data: MessageEvent["data"]) => void>();
let loaded = false;

// An example's pages are kept in the worker for as long as something here can
// still draw them; once nothing can, the worker lets them go.
const kept = new FinalizationRegistry<number>((setting) =>
	worker?.postMessage({ kind: "release", setting }),
);

/** Whether mLaTeX has loaded and set an example: the next is only a few milliseconds. */
export function warm() {
	return loaded;
}

/** Sends mLaTeX's worker a message, starting the worker the first time, and waits for its answer. */
function ask(message: object): Promise<MessageEvent["data"]> {
	if (!worker) {
		// The build's fingerprint goes with it, for the worker to ask for mLaTeX's files by.
		worker = new Worker(
			`/latex/worker.js?version=${process.env.MLATEX_VERSION}`,
		);
		worker.onmessage = ({ data }) => {
			waiting.get(data.id)?.(data);
			waiting.delete(data.id);
		};
		// A worker that can't load mLaTeX at all, such as when its files are missing.
		worker.onerror = (event) => {
			event.preventDefault();
			for (const [id, asked] of waiting) {
				waiting.delete(id);
				asked({ failure: event.message || "mLaTeX couldn't be loaded" });
			}
			worker = undefined;
		};
	}
	count += 1;
	const id = count;
	return new Promise((resolve) => {
		waiting.set(id, resolve);
		worker?.postMessage({ ...message, id });
	});
}

/**
 * Sets an example with Session.snippet, in mLaTeX's worker: whether with
 * nothing reported, its PDF, each page's size in points when mLaTeX itself
 * can draw them with `draw` -- null when this build can't, and pdf.js draws
 * the PDF instead -- what it reported, whether the page is cropped to the
 * example rather than a whole page of its class, how long it took, and why
 * mLaTeX itself failed, if it did.
 */
export function set(source: string) {
	return ask({ source }).then((data) => {
		if (!data.failure) loaded = true;
		const setting = {
			clean: Boolean(data.clean),
			pdf: (data.pdf ?? new Uint8Array()) as Uint8Array,
			sizes: (data.sizes ?? null) as { width: number; height: number }[] | null,
			/** Draws a page, from 0, at so many pixels to the point, on white. */
			draw: (page: number, scale: number) =>
				ask({ kind: "draw", setting: data.id, page, scale }).then(
					(drawn) => (drawn.image ?? null) as ImageBitmap | null,
				),
			problems: ((data.log ?? "") as string)
				.split("\n")
				.filter((line) => line.trim()),
			cropped: Boolean(data.cropped),
			time: (data.time ?? 0) as number,
			failure: (data.failure ?? "") as string,
		};
		if (setting.sizes) kept.register(setting, data.id);
		return setting;
	});
}
