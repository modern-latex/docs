import type { Metadata } from "next";
import { Contact } from "@/app/contact/client";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Contact",
	description: "Dedicated portal for any inconveniences or required support.",
});

export default function Page() {
	return <Contact />;
}
