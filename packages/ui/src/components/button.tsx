"use client";

import type * as React from "react";
import { Slot } from "radix-ui";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva(
    "inline-flex items-center justify-center whitespace-nowrap shrink-0 gap-2 **:[svg]:shrink-0 **:[svg:not([class*='size-'])]:size-4 text-sm font-medium rounded-md transition-all outline-none disabled:pointer-events-none disabled:opacity-50 **:[svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-4 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "px-4 py-2 h-10 has-[>svg]:px-4",
                sm: "gap-2 px-2 h-8 rounded-md has-[>svg]:px-2",
                lg: "px-6 h-10 rounded-md has-[>svg]:px-4",
                icon: "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Root = ({
                  className,
                  variant,
                  size,
                  asChild = false,
                  ...props
              }: React.ComponentProps<"button"> &
    VariantProps<typeof variants> & {
    asChild?: boolean;
}) => {
    const Tag = asChild ? Slot.Root : "button";

    return (
        <Tag
            data-slot="button"
            className={cn(variants({ variant, size, className }))}
            {...props}
        />
    );
};

export const Button = Root;