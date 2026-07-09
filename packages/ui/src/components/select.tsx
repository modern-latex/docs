"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Root = (props: React.ComponentProps<typeof SelectPrimitive.Root>) => (
    <SelectPrimitive.Root data-slot="select" {...props} />
);

const Group = (props: React.ComponentProps<typeof SelectPrimitive.Group>) => (
    <SelectPrimitive.Group data-slot="select-group" {...props} />
);

const Value = (props: React.ComponentProps<typeof SelectPrimitive.Value>) => (
    <SelectPrimitive.Value data-slot="select-value" {...props} />
);

const Trigger = ({
                     className,
                     children,
                     ref,
                     ...props
                 }: React.ComponentProps<typeof SelectPrimitive.Trigger>) => (
    <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        className={cn(
            "border-input flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "data-[placeholder]:text-muted-foreground",
            className,
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronsUpDown className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
);

const UpButton = ({
                      className,
                      ref,
                      ...props
                  }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        data-slot="select-up-button"
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className,
        )}
        {...props}
    >
        <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
);

const DownButton = ({
                        className,
                        ref,
                        ...props
                    }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        data-slot="select-down-button"
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className,
        )}
        {...props}
    >
        <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
);

const Content = ({
                     className,
                     children,
                     position = "popper",
                     ref,
                     ...props
                 }: React.ComponentProps<typeof SelectPrimitive.Content>) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            data-slot="select-content"
            className={cn(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md outline-hidden",
                position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className,
            )}
            position={position}
            {...props}
        >
            <UpButton />
            <SelectPrimitive.Viewport
                data-slot="select-viewport"
                className={cn(
                    "p-1",
                    position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <DownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
);

const Label = ({
                   className,
                   ref,
                   ...props
               }: React.ComponentProps<typeof SelectPrimitive.Label>) => (
    <SelectPrimitive.Label
        ref={ref}
        data-slot="select-label"
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
    />
);

const Item = ({
                  className,
                  children,
                  ref,
                  ...props
              }: React.ComponentProps<typeof SelectPrimitive.Item>) => (
    <SelectPrimitive.Item
        ref={ref}
        data-slot="select-item"
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
            className,
        )}
        {...props}
    >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="size-4" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
);

const Separator = ({
                       className,
                       ref,
                       ...props
                   }: React.ComponentProps<typeof SelectPrimitive.Separator>) => (
    <SelectPrimitive.Separator
        ref={ref}
        data-slot="select-separator"
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
);

export const Select = Object.assign(Root, {
    Group,
    Value,
    Trigger,
    Content,
    Label,
    Item,
    Separator,
    UpButton,
    DownButton,
});