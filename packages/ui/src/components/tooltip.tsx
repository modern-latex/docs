"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";
import { cn } from "@/lib/utils";

const Provider = TooltipPrimitive.Provider;

const Root = (props: React.ComponentProps<typeof TooltipPrimitive.Root>) => (
	<TooltipPrimitive.Root {...props} />
);

const Trigger = ({
	className,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) => (
	<TooltipPrimitive.Trigger
		data-slot="tooltip-trigger"
		className={cn(className)}
		{...props}
	/>
);

const Content = ({
	className,
	sideOffset = 4,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			data-slot="tooltip-content"
			sideOffset={sideOffset}
			className={cn(
				"z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				className,
			)}
			{...props}
		>
			{children}
			<TooltipPrimitive.Arrow className="fill-primary -mt-px" />
		</TooltipPrimitive.Content>
	</TooltipPrimitive.Portal>
);

export const Tooltip = Object.assign(Root, {
	Provider,
	Trigger,
	Content,
});
