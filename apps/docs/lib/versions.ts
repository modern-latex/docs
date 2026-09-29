export interface Version {
	/**
	 * Display label shown in switcher (e.g. "Latest Version", "Beta").
	 */
	label: string;
	/**
	 * Major and minor version this documentation describes (e.g. "0.1").
	 */
	version: string;
	/**
	 * Release shown under the label until GitHub lists a newer one (e.g. "0.1.0").
	 * Empty hides the line.
	 */
	release: string;
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
		label: "Latest Version",
		version: "0.1",
		release: "0.1.0",
		branch: "main",
		slug: null,
		badge: null,
	},
	{
		label: "Beta",
		version: "0.2",
		release: "",
		branch: "next",
		slug: "beta",
		badge: null,
	},
];

/**
 * The versions with each one's newest tag on modernized-latex/mlatex: a tag such as
 * `v0.2.0` is a release and one such as `v0.2.0-beta` a pre-release. The
 * latest shows the newest release, the beta the newest pre-release, and any
 * other the newest release of its own line. Checked at most once an hour;
 * when GitHub cannot be reached, the releases written above are kept.
 */
export async function releases(): Promise<Version[]> {
	const response = await fetch(
		"https://api.github.com/repos/modernized-latex/mlatex/tags?per_page=100",
		{ next: { revalidate: 3600 } },
	).catch(() => undefined);
	if (!response?.ok) return versions;
	const list: { name: string }[] = await response.json();
	// Newest first: by each number in turn, and a release before the
	// pre-releases of the same numbers.
	const tags = list
		.map((tag) => tag.name.replace(/^v/, ""))
		.filter((name) => /^\d+\.\d+\.\d+(-.+)?$/.test(name))
		.sort((left, right) => {
			const [a, before] = left.split(/-(.*)/);
			const [b, after] = right.split(/-(.*)/);
			const numbers = a.split(".").map(Number);
			const others = b.split(".").map(Number);
			for (let place = 0; place < 3; place++) {
				if (numbers[place] !== others[place]) {
					return others[place] - numbers[place];
				}
			}
			return before === after
				? 0
				: before === undefined
					? -1
					: after === undefined
						? 1
						: before < after
							? 1
							: -1;
		});
	return versions.map((version) => {
		const match = tags.find((tag) =>
			version.slug === "beta"
				? tag.includes("-")
				: !tag.includes("-") &&
					(version.slug === null || tag.startsWith(`${version.version}.`)),
		);
		return match ? { ...version, release: match } : version;
	});
}
