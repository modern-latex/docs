"use client";

import { use, useEffect, useId, useState } from "react";

type Output = {
    svg: string;
    bindFunctions?: (element: Element) => void;
};

type Driver = {
    initialize: (options: Record<string, unknown>) => void;
    render: (id: string, text: string) => Promise<Output>;
};

const Cache = new Map<string, Promise<any>>();

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
        Storage<{ default: Driver }>("mermaid", () => import("mermaid" as any)),
    );

    library.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "inherit",
        themeCSS: "margin: 1.5rem auto 0;",
        theme: "default",
    });

    const { svg: markup, bindFunctions: binder } = use(
        Storage<Output>(
            `${chart}-theme`,
            () => {
                const formatted = chart.replaceAll("\\n", "\n");
                return library.render(identifier, formatted);
            },
        ),
    );

    return (
        <div
            ref={(element) => {
                if (element && binder) {
                    binder(element);
                }
            }}
            dangerouslySetInnerHTML={{ __html: markup }}
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