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
	 * Empty shows the version as in development.
	 */
	release: string;
	/**
	 * Branch of modern-latex/docs holding this version's pages. An earlier
	 * version's pages are copied from it at build, and edit-on-GitHub links
	 * point to it.
	 */
	branch: string;
	/**
	 * URL path segment (e.g. "beta", or "0.1" for an earlier version). null =
	 * latest (no prefix).
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
	// When a new line is released, the one it replaces is kept here, with its
	// pages on a branch of its own, and served under its number: for 0.1, cut a
	// `v0.1` branch from `main` before 0.2's pages land, then add
	// { label: "0.1", version: "0.1", release: "0.1.2", branch: "v0.1",
	//   slug: "0.1", badge: null }.
];

/** Whether a version is an earlier one, kept with its own pages. */
export function archived(version: Version): boolean {
	return version.slug !== null && version.slug !== "beta";
}

/**
 * The versions with each one's newest tag on modern-latex/mlatex: a tag such as
 * `v0.2.0` is a release and one such as `v0.2.0-beta` a pre-release. The
 * latest shows the newest release, the beta the newest pre-release, and any
 * other the newest release of its own line. Checked at most once an hour;
 * when GitHub cannot be reached, the releases written above are kept.
 */
export async function releases(): Promise<Version[]> {
	const response = await fetch(
		"https://api.github.com/repos/modern-latex/mlatex/tags?per_page=100",
		{ next: { revalidate: 3600 } },
	).catch(() => undefined);
	if (!response?.ok) return order(versions);
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
	const current = versions.map((version) => {
		const match = tags.find((tag) =>
			version.slug === "beta"
				? tag.includes("-")
				: !tag.includes("-") &&
					(version.slug === null || tag.startsWith(`${version.version}.`)),
		);
		return match ? { ...version, release: match } : version;
	});
	return order(current);
}

/**
 * The release a version's pages give wherever they write x.y.z: the newest
 * tag the version menu shows for it, or the first release of its line while
 * it has none, such as "0.2.0" for a beta still in development.
 */
export async function release(version: Version): Promise<string> {
	const current = (await releases()).find(
		(other) => other.slug === version.slug,
	);
	return current?.release || `${version.version}.0`;
}

/** The beta first, then the latest, then the earlier versions, newest first. */
function order(list: Version[]): Version[] {
	const rank = (version: Version) =>
		version.slug === "beta" ? 0 : version.slug === null ? 1 : 2;
	const number = (version: Version) => version.version.split(".").map(Number);
	return [...list].sort((left, right) => {
		if (rank(left) !== rank(right)) return rank(left) - rank(right);
		const [a, b] = [number(left), number(right)];
		return b[0] - a[0] || b[1] - a[1];
	});
}
