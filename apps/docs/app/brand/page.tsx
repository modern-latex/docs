import {Metadata} from "next";
import { createMetadata } from "@/lib/metadata";
import { Brand } from "@/app/brand/client";

export const metadata: Metadata = createMetadata({
    title: "Brand Guidelines",
    description: "The design system, components, and motifs that make up the Better Auth visual language.",
    openGraph: {
        url: "/brand",
        title: "Brand Guidelines - Better Auth",
        description: "The design system, components, and motifs that make up the Better Auth visual language.",
        images: ["/api/og-release?heading=Better%20Auth%20Brand%20Guidelines"],
    },
    twitter: {
        images: ["/api/og-release?heading=Better%20Auth%20Brand%20Guidelines"],
        title: "Brand Guidelines - Better Auth",
        description: "The design system, components, and motifs that make up the Better Auth visual language.",
    },
});

export default function Page() {
    return <Brand />;
}