"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Root = ({
                  className: style,
                  ...props
              }: React.ComponentProps<typeof CommandPrimitive>) => (
    <CommandPrimitive
        data-slot="command"
        className={cn(
            "flex h-full w-full flex-col overflow-hidden bg-background text-foreground font-mono",
            style,
        )}
        {...props}
    />
);

const Dialog = ({
                    children: nodes,
                    ...props
                }: React.ComponentProps<typeof DialogPrimitive.Root> & {
    children: React.ReactNode;
}) => (
    <DialogPrimitive.Root {...props}>
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-160">
                <Root className="border border-foreground/8 bg-background shadow-2xl **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-muted-foreground">
                    {nodes}
                </Root>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
);

const Input = ({
                   className: style,
                   ...props
               }: React.ComponentProps<typeof CommandPrimitive.Input>) => (
    <div className="flex items-center border-b border-foreground/6 px-3">
        <Search className="mr-2 size-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
            data-slot="command-input"
            className={cn(
                "flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                style,
            )}
            {...props}
        />
    </div>
);

const List = ({
                  className: style,
                  ...props
              }: React.ComponentProps<typeof CommandPrimitive.List>) => (
    <CommandPrimitive.List
        data-slot="command-list"
        className={cn(
            "max-h-75 overflow-y-auto overflow-x-hidden",
            style,
        )}
        {...props}
    />
);

const Empty = ({
                   ...props
               }: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
    <CommandPrimitive.Empty
        data-slot="command-empty"
        className="py-6 text-center text-sm text-muted-foreground font-mono"
        {...props}
    />
);

const Group = ({
                   className: style,
                   ...props
               }: React.ComponentProps<typeof CommandPrimitive.Group>) => (
    <CommandPrimitive.Group
        data-slot="command-group"
        className={cn(
            "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-muted-foreground",
            style,
        )}
        {...props}
    />
);

const Item = ({
                  className: style,
                  ...props
              }: React.ComponentProps<typeof CommandPrimitive.Item>) => (
    <CommandPrimitive.Item
        data-slot="command-item"
        className={cn(
            "relative flex cursor-default gap-2 select-none items-center px-2 py-1.5 text-sm font-mono outline-none data-[selected=true]:bg-foreground/4 data-[selected=true]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            style,
        )}
        {...props}
    />
);

const Shortcut = ({
                      className: style,
                      ...props
                  }: React.ComponentProps<"span">) => (
    <span
        data-slot="command-shortcut"
        className={cn(
            "ml-auto text-xs tracking-widest text-muted-foreground font-mono",
            style,
        )}
        {...props}
    />
);

const Separator = ({
                       className: style,
                       ...props
                   }: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
    <CommandPrimitive.Separator
        data-slot="command-separator"
        className={cn("-mx-1 h-px bg-foreground/6", style)}
        {...props}
    />
);

export const Command = Object.assign(Root, {
    Dialog: Dialog,
    Input: Input,
    List: List,
    Empty: Empty,
    Group: Group,
    Item: Item,
    Shortcut: Shortcut,
    Separator: Separator,
});