"use client";

import type * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";

const Root = ({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) => (
    <AccordionPrimitive.Root data-slot="accordion" {...props} />
);

const Item = ({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
    <AccordionPrimitive.Item
        data-slot="accordion-item"
        className={cn("border-b last:border-b-0", className)}
        {...props}
    />
);

const Trigger = ({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className={cn(
                "flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium rounded-md transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 data-[open]:**:[svg]:rotate-180",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronDownIcon
                className="shrink-0 size-4 text-muted-foreground pointer-events-none translate-y-0 transition-transform duration-200"
            />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
);

const Content = ({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Panel>) => (
    <AccordionPrimitive.Panel
        data-slot="accordion-content"
        className="overflow-hidden text-sm data-closed:animate-accordion-up data-open:animate-accordion-down"
        {...props}
    >
        <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
);

export const Accordion = Object.assign(Root, {
    Item: Item,
    Trigger: Trigger,
    Content: Content,
});