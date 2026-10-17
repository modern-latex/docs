export interface Statistics {
	/** Downloads in the last week, from npm and PyPI together. */
	downloads: number;
	stars: number;
	contributors: number;
	members: number;
	/** The engine's license, such as "AGPL-3.0". */
	license: string;
}

const repository = "modern-latex/mlatex";
const invite = "UUbPg5YtJF";

/** A JSON answer, or nothing when the service can't be reached or has no such thing. */
async function read<Shape>(url: string, headers?: HeadersInit) {
	const response = await fetch(url, {
		headers,
		next: { revalidate: 3600 },
	}).catch(() => undefined);
	if (!response?.ok) return undefined;
	return (await response.json().catch(() => undefined)) as Shape | undefined;
}

/**
 * mLaTeX in numbers: its downloads on npm and PyPI, and its stars, contributors
 * and license on GitHub, with the members of its Discord server. Checked at
 * most once an hour; a number a service doesn't give is zero.
 */
export async function statistics(): Promise<Statistics> {
	const github: HeadersInit = process.env.GITHUB_TOKEN
		? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
		: {};
	const [javascript, python, project, people, server] = await Promise.all([
		read<{ downloads: number }>(
			"https://api.npmjs.org/downloads/point/last-week/mlatex",
		),
		read<{ data: { last_week: number } }>(
			"https://pypistats.org/api/packages/mlatex/recent",
		),
		read<{ stargazers_count: number; license: { spdx_id: string } | null }>(
			`https://api.github.com/repos/${repository}`,
			github,
		),
		read<unknown[]>(
			`https://api.github.com/repos/${repository}/contributors?per_page=100&anon=1`,
			github,
		),
		read<{ approximate_member_count: number }>(
			`https://discord.com/api/v9/invites/${invite}?with_counts=true`,
		),
	]);
	return {
		downloads: (javascript?.downloads ?? 0) + (python?.data.last_week ?? 0),
		stars: project?.stargazers_count ?? 0,
		contributors: people?.length ?? 0,
		members: server?.approximate_member_count ?? 0,
		license: project?.license?.spdx_id ?? "AGPL-3.0",
	};
}
