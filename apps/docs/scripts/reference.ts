/**
 * Writes the Package Reference, content/docs/reference/<subject>/<package>.mdx,
 * and the overview at content/docs/packages/index.mdx, from a checkout of
 * mLaTeX: node scripts/reference.ts ../mlatex
 *
 * Each page is the package's purpose, how it is loaded and supported, the
 * commands it gives, any limits, and the document from mLaTeX's
 * tests/packages that uses it, so every example is one mLaTeX's own tests
 * compile. What the sources do not say -- each package's subject, some
 * summaries, the limits -- is in scripts/reference.json, to edit by hand.
 */
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

const checkout = process.argv[2];
if (!checkout || !existsSync(join(checkout, "tests", "packages"))) {
	console.error(
		"Usage: node scripts/reference.ts <checkout of modern-latex/mlatex>",
	);
	process.exit(1);
}

const data: {
	subjects: Record<
		string,
		{ title: string; description: string; packages?: string[] }
	>;
	classes: Record<string, string>;
	summaries: Record<string, string>;
	limits: Record<string, string>;
} = JSON.parse(
	readFileSync(join(import.meta.dirname, "reference.json"), "utf8"),
);

// Every sample document names a package or, as class-<name>, a class. A
// package is a module of its own, provided by mLaTeX, or another under a
// second name, as src/modules/core/compatibility.mtex says.
const modules = new Set(
	readdirSync(join(checkout, "src", "modules"), { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name),
);
const compatibility = readFileSync(
	join(checkout, "src", "modules", "core", "compatibility.mtex"),
	"utf8",
);
const provided = new Set(
	[...compatibility.matchAll(/\\@providepackage\{([^}]*)\}/g)].flatMap(
		(match) =>
			match[1]
				.split(",")
				.map((name) => name.trim())
				.filter(Boolean),
	),
);
const aliases = new Map(
	[
		...compatibility.matchAll(/\\@setvariable\{alias\.([^}]*)\}\{([^}]*)\}/g),
	].map((match) => [match[1], match[2]]),
);

type Row = {
	name: string;
	kind: "module" | "provided" | "alias" | "glossary" | "class";
	target?: string;
	sample: string;
};
const rows: Row[] = readdirSync(join(checkout, "tests", "packages"))
	.filter((file) => file.endsWith(".mtex"))
	.sort()
	.map((file) => {
		const stem = file.slice(0, -".mtex".length);
		const sample = readFileSync(
			join(checkout, "tests", "packages", file),
			"utf8",
		).replace(/\r\n/g, "\n");
		if (stem.startsWith("class-")) {
			return { name: stem.slice("class-".length), kind: "class", sample };
		}
		if (modules.has(stem)) return { name: stem, kind: "module", sample };
		if (aliases.has(stem)) {
			return { name: stem, kind: "alias", target: aliases.get(stem), sample };
		}
		return {
			name: stem,
			kind: provided.has(stem) ? "provided" : "glossary",
			sample,
		};
	});
const packages = new Set(
	rows.filter((row) => row.kind !== "class").map((row) => row.name),
);

// Each package's subject, from reference.json. One it does not list yet goes
// under Other Packages, to be sorted by hand.
// A class is keyed apart from a package of the same name, as standalone is
// both: each has a page of its own, the class's under Classes.
const key = (row: Row) =>
	row.kind === "class" ? `class:${row.name}` : row.name;
const subject = new Map<string, string>();
for (const [group, entry] of Object.entries(data.subjects)) {
	for (const name of entry.packages ?? []) {
		if (subject.has(name)) {
			console.error(`${name} is in ${subject.get(name)} and ${group}`);
			process.exit(1);
		}
		if (packages.has(name)) subject.set(name, group);
	}
}
for (const row of rows) {
	if (row.kind === "class") subject.set(key(row), "classes");
	else if (!subject.has(row.name)) {
		console.warn(`${row.name} has no subject in reference.json yet`);
		subject.set(row.name, "others");
	}
}
const subjects = { ...data.subjects };
if ([...subject.values()].includes("others")) {
	subjects.others = {
		title: "Other Packages",
		description: "Packages added to mLaTeX that are not sorted yet.",
	};
}

// A module's header: the comment its main.mtex opens with, as one line.
const headers = new Map<string, string>();
for (const name of modules) {
	const file = join(checkout, "src", "modules", name, "main.mtex");
	if (!existsSync(file)) continue;
	const lines: string[] = [];
	for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
		if (!line.startsWith("%")) break;
		const text = line.replace(/^%+\s?/, "").trim();
		if (text) lines.push(text);
	}
	const text = lines.join(" ").replace(/\s+/g, " ");
	headers.set(
		name,
		text.startsWith(`${name}: `) ? text.slice(name.length + 2) : text,
	);
}

/** The first sentence of a header, with TeX in code spans so MDX reads it as text. */
function sentence(text: string) {
	let first = text
		.split(/(?<=[a-z0-9)\]'])\. (?=[A-Z\\])/, 1)[0]
		.replace(/\.$/, "")
		.replace(/\s+--\s+/g, " — ");
	first = first
		.split(/(`[^`]*`)/)
		.map((part) =>
			part.startsWith("`")
				? part
				: part.replace(
						/(\\[A-Za-z@]+\*?(?:\[[^\]]*\])?(?:\{[^{}]*\})*|\[[A-Za-z!]+\]|[<>]\{[^}]*\}|\{\}|[A-Za-z]\{[^}]*\}(?:\{[^}]*\})*)/g,
						(match) => `\`${match}\``,
					),
		)
		.join("")
		.replaceAll("|", "\\|");
	return `${first.slice(0, 1).toUpperCase()}${first.slice(1)}.`;
}

function describe(row: Row) {
	if (row.kind === "class") return `${data.classes[row.name] ?? row.name}.`;
	if (row.kind === "module") {
		return data.summaries[row.name]
			? `${data.summaries[row.name]}.`
			: sentence(headers.get(row.name) ?? "");
	}
	const text = row.sample
		.split("\n", 1)[0]
		.slice(2)
		.split(": ")
		.slice(1)
		.join(": ")
		.trim();
	if (text.startsWith("a family of faces")) {
		return "A font family. Text asking for it is set in the nearest of the faces mLaTeX carries.";
	}
	return sentence(text);
}

// Commands: a module's own public definitions, and the glossary's lines under
// a package's name, where a section opens with a rule and a comment naming
// its packages before a colon.
const commands = new Map<string, string[]>();
const add = (name: string, command: string) => {
	const listed = commands.get(name) ?? [];
	if (!listed.includes(command)) listed.push(command);
	commands.set(name, listed);
};
for (const row of rows) {
	if (row.kind !== "module") continue;
	const source = readFileSync(
		join(checkout, "src", "modules", row.name, "main.mtex"),
		"utf8",
	)
		.split(/\r?\n/)
		.map((line) =>
			line.trimStart().startsWith("%") ? "" : line.split("%", 1)[0],
		)
		.join("\n");
	for (const match of source.matchAll(
		/\\(?:@define|@alias|newcommand\*?|renewcommand\*?|providecommand\*?|DeclareRobustCommand|def|let)\s*\{?\\([A-Za-z]+)\b/g,
	)) {
		add(row.name, match[1]);
	}
}
let section: string[] = [];
let heading = false;
for (const line of readFileSync(
	join(checkout, "assets", "glossary.mtex"),
	"utf8",
).split(/\r?\n/)) {
	if (line.startsWith("% ----")) {
		section = [];
		heading = true;
		continue;
	}
	if (heading && line.startsWith("% ")) {
		const named = line.includes(":") ? line.slice(2).split(":", 1)[0] : "";
		section = named
			.split(/,|\band\b/)
			.map((name) => name.trim())
			.filter((name) => packages.has(name));
		heading = false;
		continue;
	}
	const found = /^\\([A-Za-z]+)(?![A-Za-z@])/.exec(line);
	if (found) for (const name of section) add(name, found[1]);
}

// And what each sample uses, less the everyday LaTeX a dozen or more samples
// share, loop variables, and commands another package owns.
const used = new Map(
	rows.map((row) => [
		row.name,
		new Set(
			[
				...row.sample
					.split("\n")
					.filter((line) => !line.startsWith("%"))
					.map((line) => line.split("%", 1)[0])
					.join("\n")
					.matchAll(/\\([A-Za-z]+)/g),
			].map((match) => match[1]),
		),
	]),
);
const shared = new Map<string, number>();
for (const names of used.values()) {
	for (const name of names) shared.set(name, (shared.get(name) ?? 0) + 1);
}
const owners = new Map<string, Set<string>>();
const own = (command: string, name: string) =>
	owners.set(command, (owners.get(command) ?? new Set()).add(name));
for (const [name, listed] of commands)
	for (const command of listed) own(command, name);
for (const [name, text] of headers) {
	for (const match of text.matchAll(/\\([A-Za-z]+)/g)) own(match[1], name);
}
const kernel = new Set(
	`ref label pageref cite textit textbf textrm textsf texttt textsc textsl textup emph itshape bfseries
	scshape slshape upshape rmfamily sffamily ttfamily mdseries normalfont tiny scriptsize footnotesize small normalsize
	large Large LARGE huge Huge centering raggedright raggedleft par newline linebreak newpage clearpage hspace vspace
	hfill vfill quad qquad noindent indent caption includegraphics linewidth textwidth hline frac sqrt sum int alpha
	beta gamma pi ldots dots cdots today item maketitle title author date thanks footnote and the value arabic roman
	setlength setcounter addtocounter stepcounter newcommand renewcommand newenvironment def let relax makeatletter
	makeatother c v u H k r b d t i j o O l L ss ae oe aa AA`.split(/\s+/),
);
for (const row of rows) {
	const loops = new Set(
		[...row.sample.matchAll(/\\foreach\s*\\([A-Za-z]+)/g)].map(
			(match) => match[1],
		),
	);
	for (const command of [...(used.get(row.name) ?? [])].sort()) {
		if (
			(shared.get(command) ?? 0) < 12 &&
			!kernel.has(command) &&
			!loops.has(command) &&
			(!owners.has(command) || owners.get(command)?.has(row.name))
		) {
			add(row.name, command);
		}
	}
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9_-]/g, "");
const link = (name: string) =>
	`/docs/reference/${subject.get(name)}/${slug(name)}`;
const href = (row: Row) =>
	`/docs/reference/${subject.get(key(row))}/${slug(row.name)}`;
const sorted = (list: string[]) =>
	[...new Set(list)].sort((a, b) =>
		a.toLowerCase() < b.toLowerCase()
			? -1
			: a.toLowerCase() > b.toLowerCase()
				? 1
				: a < b
					? -1
					: a > b
						? 1
						: 0,
	);
const order = (a: Row, b: Row) =>
	a.name.toLowerCase() < b.name.toLowerCase()
		? -1
		: a.name.toLowerCase() > b.name.toLowerCase()
			? 1
			: 0;

const docs = join(import.meta.dirname, "..", "content", "docs");
const reference = join(docs, "reference");
rmSync(reference, { recursive: true, force: true });
for (const [name, entry] of Object.entries(subjects)) {
	const members = rows
		.filter((row) => subject.get(key(row)) === name)
		.sort(order);
	const folder = join(reference, name);
	mkdirSync(folder, { recursive: true });
	const noun = name === "classes" ? "classes" : "packages";
	writeFileSync(
		join(folder, "index.mdx"),
		`${[
			"---",
			`title: ${entry.title}`,
			`description: ${entry.description}`,
			"---",
			"",
			`${members.length} ${noun}. Each page says how mLaTeX supports one, lists the commands it gives, and shows a document that uses it, taken from mLaTeX's own tests so that it compiles as written.`,
			"",
			"| Name | What it does |",
			"| --- | --- |",
			...members.map(
				(row) =>
					`| [\`${row.name}\`](${href(row)}) | ${describe(row).replace(/\.$/, "")} |`,
			),
		].join("\n")}\n`,
	);
	for (const row of members) {
		const about = describe(row)
			.replaceAll("`", "")
			.replaceAll("\\|", "|")
			.replaceAll("'", "''");
		const lines = [
			"---",
			`title: ${row.name}`,
			`description: '${about}'`,
			"---",
			"",
			"## Loading",
			"",
			"```latex",
			row.kind === "class"
				? `\\documentclass{${row.name}}`
				: `\\usepackage{${row.name}}`,
			"```",
			"",
			row.kind === "module"
				? "A module of its own, compiled into mLaTeX: the package's commands are defined over mLaTeX's primitives."
				: row.kind === "provided"
					? "Built into mLaTeX. Loading it is accepted and reads nothing; what the package does is mLaTeX's own work, and any command of it that mLaTeX does not define comes from the glossary."
					: row.kind === "alias"
						? `Loads [\`${row.target}\`](${link(row.target ?? "")}) under this name, so a document asking for either gets the same.`
						: row.kind === "glossary"
							? "Not compiled in: loading it is a warning, and its commands come from the glossary the first time a document uses them."
							: "A class of mLaTeX's own: its paper, type size and columns are read from its options.",
			"",
		];
		const listed = commands.get(row.name);
		if (listed?.length) {
			lines.push(
				"## Commands",
				"",
				`${sorted(listed)
					.map((command) => `\`\\${command}\``)
					.join(", ")}.`,
				"",
			);
		}
		const body = row.sample.split("\n");
		while (body.length && body[0].startsWith("%")) body.shift();
		while (body.length && body[body.length - 1] === "") body.pop();
		lines.push(
			"## Example",
			"",
			"A document that uses it, from mLaTeX's own tests, so it compiles as written:",
			"",
			`\`\`\`latex title="${row.name}.tex"`,
			...body,
			"```",
			"",
		);
		if (data.limits[row.name]) {
			lines.push(
				"## Limits",
				"",
				'<Callout type="warn">',
				`  ${data.limits[row.name]}.`,
				"</Callout>",
				"",
			);
		}
		writeFileSync(
			join(folder, `${slug(row.name)}.mdx`),
			`${lines.join("\n").trimEnd()}\n`,
		);
	}
	writeFileSync(
		join(folder, "meta.json"),
		`${JSON.stringify({ title: entry.title, pages: ["index", ...members.map((row) => slug(row.name))] }, null, 2)}\n`,
	);
}
writeFileSync(
	join(reference, "meta.json"),
	`${JSON.stringify({ title: "Reference", pages: Object.keys(subjects) }, null, 2)}\n`,
);

// The overview: how packages are supported, and every one by subject, each
// linked to its page.
const count = (kind: Row["kind"]) =>
	rows.filter((row) => row.kind === kind).length;
const overview = [
	"---",
	"title: Supported Packages",
	"description: Every package and class mLaTeX reads, how each one is supported, and what happens with the rest.",
	"---",
	"",
	`mLaTeX reads **${packages.size} packages** and **${count("class")} document classes**, plus LaTeX's standard \`article\`, \`report\` and \`book\`. Each one is checked by a small document of its own that uses what the package is loaded for, and mLaTeX's tests fail if any of them reports an error or an unknown command.`,
	"",
	"## How a package is supported",
	"",
	"### A module of its own",
	"",
	`${count("module")} packages are written in mLaTeX's language and compiled into the program, their commands defined over mLaTeX's own primitives.`,
	"",
	"### Built in",
	"",
	`${count("provided")} packages need nothing loaded, because mLaTeX already does their job. \`graphicx\` (\`\\includegraphics\` is part of mLaTeX), \`xcolor\`, \`inputenc\`, \`microtype\` and the font packages are here. Any of their commands a document uses that mLaTeX does not define comes from the glossary.`,
	"",
	"### Under another name",
	"",
	`${count("alias")} packages are another one under a newer or older name, and load that one.`,
	"",
	"### Packages that are not listed",
	"",
	"`\\usepackage{anything}` never stops a document. A package mLaTeX does not know is marked as loaded and named in a warning, and its commands are looked up in the **glossary**, about 630 commands from CTAN packages with no module of their own, the first time the document uses them. A command neither knows is an error where it is used, as in LaTeX.",
	"",
	'<Callout type="info">',
	"  Being listed means a package loads and its common commands set text, not that every feature of it is drawn. Where a package is only partly supported, its entry in the reference says so.",
	"</Callout>",
	"",
	"***",
	"",
	"## Every package by subject",
	"",
];
for (const [name, entry] of Object.entries(subjects)) {
	const members = rows
		.filter((row) => subject.get(key(row)) === name)
		.sort(order);
	overview.push(
		`### ${entry.title}`,
		"",
		`${entry.description} [Read the reference](/docs/reference/${name}).`,
		"",
		`${members.map((row) => `[\`${row.name}\`](${href(row)})`).join(", ")}.`,
		"",
	);
}
overview.push(
	"***",
	"",
	"## Adding a package",
	"",
	"A package is a folder with one file in it, `name/main.mtex`, and a document finds it beside itself without rebuilding anything. See [Writing Packages](/docs/packages/writing).",
	"",
);
writeFileSync(join(docs, "packages", "index.mdx"), overview.join("\n"));
console.log(
	`${rows.length} pages in ${Object.keys(subjects).length} subjects, from ${packages.size} packages and ${count("class")} classes`,
);
