export const theme = {
	colors: [
		{ name: "background", label: "Background" },
		{ name: "foreground", label: "Foreground" },
		{ name: "primary", label: "Primary" },
		{ name: "primary-foreground", label: "Primary FG" },
		{ name: "secondary", label: "Secondary" },
		{ name: "secondary-foreground", label: "Secondary FG" },
		{ name: "muted", label: "Muted" },
		{ name: "muted-foreground", label: "Muted FG" },
		{ name: "accent", label: "Accent" },
		{ name: "accent-foreground", label: "Accent FG" },
		{ name: "border", label: "Border" },
		{ name: "input", label: "Input" },
		{ name: "ring", label: "Ring" },
		{ name: "destructive", label: "Destructive" },
	],
	callouts: [
		{ name: "info", color: "bg-blue-500", label: "Info" },
		{ name: "warn", color: "bg-orange-500", label: "Warn" },
		{ name: "error", color: "bg-red-500", label: "Error" },
		{ name: "success", color: "bg-green-500", label: "Success" },
	],
} as const;

export const layout = {
	radii: [
		{ label: "sharp (code)", value: "0" },
		{ label: "sm", value: "calc(var(--radius) - 2px)" },
		{ label: "md", value: "calc(var(--radius) - 1px)" },
		{ label: "lg (default)", value: "var(--radius)" },
		{ label: "xl", value: "calc(var(--radius) + 4px)" },
	],
	shadows: [
		{ label: "xs", token: "shadow-xs" },
		{ label: "sm", token: "shadow-sm" },
		{ label: "md", token: "shadow-md" },
		{ label: "lg", token: "shadow-lg" },
		{ label: "xl", token: "shadow-xl" },
	],
} as const;
