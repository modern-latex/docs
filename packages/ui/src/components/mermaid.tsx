"use client";

import { use, useEffect, useId, useState } from "react";

const Cache = new Map<string, Promise<unknown>>();

function Storage<Generic>(
	key: string,
	factory: () => Promise<Generic>,
): Promise<Generic> {
	const cached = Cache.get(key);
	if (cached) {
		return cached as Promise<Generic>;
	}

	const created = factory();
	Cache.set(key, created);
	return created;
}

const Content = ({ chart }: { chart: string }) => {
	const identifier = useId();

	const { default: library } = use(
		Storage<{
			default: {
				initialize: (options: Record<string, unknown>) => void;
				render: (
					id: string,
					text: string,
				) => Promise<{
					svg: string;
					bindFunctions?: (element: Element) => void;
				}>;
			};
		}>("mermaid", () => import("mermaid")),
	);

	library.initialize({
		startOnLoad: false,
		securityLevel: "loose",
		fontFamily: "inherit",
		themeCSS: "margin: 1.5rem auto 0;",
		theme: "default",
	});

	const { svg: markup, bindFunctions: binder } = use(
		Storage<{
			svg: string;
			bindFunctions?: (element: Element) => void;
		}>(`${chart}-theme`, () => {
			const formatted = chart.replaceAll("\\n", "\n");
			return library.render(identifier, formatted);
		}),
	);

	return (
		<div
			ref={(element) => {
				if (element) {
					element.innerHTML = markup;
					if (binder) {
						binder(element);
					}
				}
			}}
		/>
	);
};

const Root = ({ chart }: { chart: string }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return <Content chart={chart} />;
};

export const Mermaid = Object.assign(Root, {
	Content: Content,
});
