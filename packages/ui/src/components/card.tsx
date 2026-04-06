"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

const root = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card"
        className={cn(
            "text-foreground flex flex-col gap-4 border border-foreground/10 p-4",
            className,
        )}
        {...props}
    />
);

const header = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card-header"
        className={cn("flex flex-col gap-1", className)}
        {...props}
    />
);

const title = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card-title"
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
    />
);

const description = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card-description"
        className={cn("text-foreground/50 text-sm", className)}
        {...props}
    />
);

const action = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card-action"
        className={cn(
            "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
            className,
        )}
        {...props}
    />
);

const content = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div data-slot="card-content" className={cn("", className)} {...props} />
);

const footer = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="card-footer"
        className={cn(
            "flex items-center border-t border-foreground/5 pt-3",
            className,
        )}
        {...props}
    />
);

export const Card = Object.assign(root, {
    Header: header,
    Title: title,
    Description: description,
    Action: action,
    Content: content,
    Footer: footer,
});