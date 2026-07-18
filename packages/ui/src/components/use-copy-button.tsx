"use client";

import type { MouseEventHandler } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyButton(
	onCopy: () => void | Promise<void>,
): [copied: boolean, handleCopy: MouseEventHandler] {
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | null>(null);

	const handleCopy: MouseEventHandler = useCallback(() => {
		if (timer.current) window.clearTimeout(timer.current);

		const response = Promise.resolve(onCopy());

		void response.then(() => {
			setCopied(true);
			timer.current = window.setTimeout(() => {
				setCopied(false);
			}, 1500);
		});
	}, [onCopy]);

	useEffect(() => {
		return () => {
			if (timer.current) window.clearTimeout(timer.current);
		};
	}, []);

	return [copied, handleCopy];
}
