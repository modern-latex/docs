"use client";

import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

const Root = ({
                  ...props
              }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
    <DrawerPrimitive.Root data-slot="drawer" {...props} />
);

const Trigger = ({
                     ref,
                     ...props
                 }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => (
    <DrawerPrimitive.Trigger ref={ref} data-slot="drawer-trigger" {...props} />
);

const Portal = ({
                    ...props
                }: React.ComponentProps<typeof DrawerPrimitive.Portal>) => (
    <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

const Close = ({
                   ref,
                   ...props
               }: React.ComponentProps<typeof DrawerPrimitive.Close>) => (
    <DrawerPrimitive.Close ref={ref} data-slot="drawer-close" {...props} />
);

const Overlay = ({
                     ref,
                     className,
                     ...props
                 }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        data-slot="drawer-overlay"
        className={cn(
            "fixed inset-0 z-200 bg-background/50 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
            className,
        )}
        {...props}
    />
);

const Content = ({
                     ref,
                     className,
                     children,
                     ...props
                 }: React.ComponentProps<typeof DrawerPrimitive.Content>) => (
    <Portal>
        <Overlay />
        <DrawerPrimitive.Content
            ref={ref}
            data-slot="drawer-content"
            className={cn(
                "group/drawer-content fixed z-200 flex h-auto flex-col bg-background",
                "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
                "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
                "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
                "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
                className,
            )}
            {...props}
        >
            {children}
        </DrawerPrimitive.Content>
    </Portal>
);

const Header = ({
                    ref,
                    className,
                    ...props
                }: React.ComponentProps<"div">) => (
    <div
        ref={ref}
        data-slot="drawer-header"
        className={cn(
            "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
            className,
        )}
        {...props}
    />
);

const Footer = ({
                    ref,
                    className,
                    ...props
                }: React.ComponentProps<"div">) => (
    <div
        ref={ref}
        data-slot="drawer-footer"
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />
);

const Title = ({
                   ref,
                   className,
                   ...props
               }: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
    <DrawerPrimitive.Title
        ref={ref}
        data-slot="drawer-title"
        className={cn("font-semibold text-foreground", className)}
        {...props}
    />
);

const Description = ({
                         ref,
                         className,
                         ...props
                     }: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
    <DrawerPrimitive.Description
        ref={ref}
        data-slot="drawer-description"
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
);

export const Drawer = Object.assign(Root, {
    Trigger,
    Portal,
    Close,
    Overlay,
    Content,
    Header,
    Footer,
    Title,
    Description,
});