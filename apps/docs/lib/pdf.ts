import type { PDFWorker } from "pdfjs-dist";

let reader: Promise<{
	pdfjs: typeof import("pdfjs-dist");
	worker: PDFWorker;
}> | null = null;

/**
 * pdf.js, with one worker of its own that every example shares. Handing it the
 * worker keeps it from starting one per PDF, and from falling back to drawing
 * on the page's thread when one is slow to start.
 */
export function load() {
	reader ??= import("pdfjs-dist").then((pdfjs) => {
		pdfjs.GlobalWorkerOptions.workerSrc = "/latex/pdf.worker.min.mjs";
		const port = new Worker("/latex/pdf.worker.min.mjs", { type: "module" });
		// pdf.js takes a Worker as the port, though its types say it takes none.
		// @ts-expect-error
		return { pdfjs, worker: new pdfjs.PDFWorker({ port }) };
	});
	return reader;
}
