export interface Setting {
	/** Whether mLaTeX set the example with nothing reported. */
	clean: boolean;
	/** The PDF, or no bytes when none could be made. */
	pdf: Uint8Array;
	/**
	 * Each page's width and height in points, when mLaTeX itself can draw
	 * them with #draw; null when this build of mLaTeX can't, and pdf.js draws
	 * the PDF instead.
	 */
	sizes: { width: number; height: number }[] | null;
	/** Draws a page, from 0, at so many pixels to the point, on white. */
	draw: (page: number, scale: number) => Promise<ImageBitmap | null>;
	/** What mLaTeX reported, one error or warning to a line. */
	problems: string[];
	/** Whether the page is cropped to what the example holds, rather than a whole page of its class. */
	cropped: boolean;
	/** How long it took to set, in milliseconds. */
	time: number;
	/** Why mLaTeX itself failed, such as an abort, rather than the example; empty when it didn't. */
	failure: string;
}

let worker: Worker | undefined;
let count = 0;
const waiting = new Map<number, (setting: Setting) => void>();
const drawing = new Map<number, (image: ImageBitmap | null) => void>();

// An example's pages are kept in the worker for as long as something here can
// still draw them; once nothing can, the worker lets them go.
const kept = new FinalizationRegistry<number>((setting) =>
	worker?.postMessage({ kind: "release", setting }),
);

let loaded = false;

/** Whether mLaTeX has loaded and set an example: the next is only a few milliseconds. */
export function warm() {
	return loaded;
}

/** A page of an example, drawn by mLaTeX in its worker. */
function drawer(setting: number) {
	return (page: number, scale: number) => {
		count += 1;
		const id = count;
		return new Promise<ImageBitmap | null>((resolve) => {
			drawing.set(id, resolve);
			worker?.postMessage({ kind: "draw", id, setting, page, scale });
		});
	};
}

/** Sets an example with Session.snippet, in mLaTeX's worker. */
export function set(source: string): Promise<Setting> {
	if (!worker) {
		// The build's fingerprint goes with it, for the worker to ask for mLaTeX's files by.
		worker = new Worker(
			`/latex/worker.js?version=${process.env.MLATEX_VERSION}`,
		);
		worker.onmessage = ({ data }) => {
			if (data.kind === "drawn") {
				drawing.get(data.id)?.(data.image ?? null);
				drawing.delete(data.id);
				return;
			}
			const asked = waiting.get(data.id);
			waiting.delete(data.id);
			if (!data.failure) loaded = true;
			const setting: Setting = {
				clean: data.clean,
				pdf: data.pdf,
				sizes: data.sizes ?? null,
				draw: drawer(data.id),
				problems: (data.log as string)
					.split("\n")
					.filter((line) => line.trim()),
				cropped: data.cropped,
				time: data.time,
				failure: data.failure ?? "",
			};
			if (setting.sizes) kept.register(setting, data.id);
			asked?.(setting);
		};
		// A worker that can't load mLaTeX at all, such as when its files are missing.
		worker.onerror = (event) => {
			event.preventDefault();
			for (const [id, asked] of waiting) {
				waiting.delete(id);
				asked({
					clean: false,
					pdf: new Uint8Array(),
					sizes: null,
					draw: async () => null,
					problems: [],
					cropped: false,
					time: 0,
					failure: event.message || "mLaTeX couldn't be loaded",
				});
			}
			worker = undefined;
		};
	}
	count += 1;
	const id = count;
	return new Promise((resolve) => {
		waiting.set(id, resolve);
		worker?.postMessage({ id, source });
	});
}
