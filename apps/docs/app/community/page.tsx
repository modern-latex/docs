import type { Metadata } from "next";
import { Community } from "@/app/community/client";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Community",
	description:
		"Join our community — contributors, Discord members, and ecosystem stats.",
});

export default async function Page() {
	return <Community />;
}
