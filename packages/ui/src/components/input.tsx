"use client";

import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "../lib/utils";

const Root = ({ className, type, ...props }: React.ComponentProps<"input">) => (
	<input
		type={type}
		data-slot="input"
		className={cn(
			"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			className,
		)}
		{...props}
	/>
);

/** A password field with a button that shows or hides what was typed. */
const Password = ({
	className,
	...props
}: Omit<React.ComponentProps<"input">, "type">) => {
	const [visible, setVisible] = React.useState(false);
	const Icon = visible ? EyeOffIcon : EyeIcon;

	return (
		<div className="relative">
			<Root
				type={visible ? "text" : "password"}
				className={cn("pr-10", className)}
				{...props}
			/>
			<button
				type="button"
				aria-label={visible ? "Hide password" : "Show password"}
				aria-pressed={visible}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
				onClick={() => setVisible((shown) => !shown)}
			>
				<Icon className="size-4" />
			</button>
		</div>
	);
};

export const Input = Object.assign(Root, { Password });
