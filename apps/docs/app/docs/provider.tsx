"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { createContext } from "react";
import Dialog from "@/components/dialog";

export interface Entry {
	name: string;
	url: string;
}

export const Context = createContext<Entry[]>([]);

export function DocsProvider({
	entries,
	children,
}: {
	entries: Entry[];
	children: ReactNode;
}) {
	return (
		<Context value={entries}>
			<RootProvider
				search={{
					SearchDialog: Dialog,
				}}
			>
				{children}
			</RootProvider>
		</Context>
	);
}
