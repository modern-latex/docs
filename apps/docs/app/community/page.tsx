import type { Metadata } from "next";

import { Community } from "@/app/community/client";
import { statistics } from "@/lib/community";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Community",
	description:
		"Join the mLaTeX community: its contributors, its Discord server, and the project in numbers.",
});

export default async function Page() {
	return <Community statistics={await statistics()} />;
}
