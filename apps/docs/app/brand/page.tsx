import {Metadata} from "next";
import { createMetadata } from "@/lib/metadata";
import { Brand } from "@/app/brand/client";

export const metadata: Metadata = createMetadata({
    title: "Brand Guidelines",
    description: "The design system, components, and motifs that make up the Better Auth visual language.",
});

export default function Page() {
    return <Brand />;
}