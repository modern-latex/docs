import type { Metadata } from "next";
import { Brand } from "@/app/brand/client";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Brand Guidelines",
	description:
		"The design system, components, and motifs that make up our visual language.",
});

export default function Page() {
	return <Brand />;
}
