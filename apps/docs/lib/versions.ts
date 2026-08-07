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
 * The versions with each one's newest release on GitHub: the newest release
 * for the latest, the newest pre-release for the beta, and the newest release
 * of its own line for any other. Checked at most once an hour; when GitHub
 * cannot be reached, the releases written above are kept.
 */
export async function releases(): Promise<Version[]> {
	const response = await fetch(
		"https://api.github.com/repos/aveloux/mlatex/releases",
		{ next: { revalidate: 3600 } },
	).catch(() => undefined);
	if (!response?.ok) return versions;
	const list: { tag_name: string; prerelease: boolean; draft: boolean }[] =
		await response.json();
	return versions.map((version) => {
		const match = list.find(
			(release) =>
				!release.draft &&
				(version.slug === "beta"
					? release.prerelease
					: !release.prerelease &&
						(version.slug === null ||
							release.tag_name
								.replace(/^v/, "")
								.startsWith(`${version.version}.`))),
		);
		return match
			? { ...version, release: match.tag_name.replace(/^v/, "") }
			: version;
	});
}
