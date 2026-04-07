import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { Community } from "./client";

export const metadata: Metadata = createMetadata({
	title: "Community",
	description: "Join the Better Auth community — contributors, Discord members, and ecosystem stats.",
});


export default async function Page() {
	return <Community />;
}
