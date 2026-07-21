export interface Version {
	/**
	 * Display label shown in switcher (e.g. "Latest", "Beta")
	 */
	label: string;
	/**
	 * Numeric version for badge rendering (e.g. "1.6").
	 */
	version: string;
	/**
	 * Branch holding this version's source code (for edit-on-github links).
	 */
	branch: string;
	/**
	 * URL path segment (e.g. "beta"). null = latest (no prefix).
	 */
	slug: string | null;
	/**
	 * Small badge shown next to label (e.g. "beta").
	 */
	badge: string | null;
}

export const versions: Version[] = [
	{
		label: "v1.7 (Beta)",
		version: "1.7",
		branch: "next",
		slug: "beta",
		badge: null,
	},
	{
		label: "v1.6 (Latest)",
		version: "1.6",
		branch: "main",
		slug: null,
		badge: null,
	},
];
