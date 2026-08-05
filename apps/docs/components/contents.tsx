import type { ReactNode, SVGProps } from "react";

import type { LucideIcon } from "lucide-react";
import {
	ArrowRightLeft,
	Binary,
	Boxes,
	Braces,
	CircleHelp,
	Code,
	FileText,
	FileType,
	Gauge,
	GitCompare,
	Globe,
	Image,
	Languages,
	Layers,
	LifeBuoy,
	Link,
	Package,
	PackagePlus,
	PenTool,
	Plug,
	Presentation,
	Quote,
	ShieldCheck,
	Sigma,
	SquareTerminal,
	Table,
	Terminal,
	Type,
	Workflow,
	Wrench,
} from "lucide-react";

export interface SubItems {
	title: string;
	href?: string;
	icon?: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
	group?: boolean;
}

export interface Item {
	title: string;
	href?: string;
	icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
	group?: boolean;
	separator?: boolean;
	isNew?: boolean;
	subitems?: SubItems[];
	external?: boolean;
}

interface Contents {
	title: string;
	href?: string;
	expandSectionForPathPrefix?: string;
	Icon: ((props?: SVGProps<any>) => ReactNode) | LucideIcon;
	isNew?: boolean;
	list: Item[];
}

export const contents: Contents[] = [
	{
		title: "Get Started",
		Icon: () => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.4em"
				height="1.4em"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-1 14H9V8h2zm1 0V8l5 4z"
				/>
			</svg>
		),
		list: [
			{
				title: "Introduction",
				href: "/docs/introduction",
				icon: () => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.2em"
						height="1.2em"
						viewBox="0 0 256 256"
					>
						<path
							fill="currentColor"
							d="M232 48h-64a32 32 0 0 0-32 32v87.73a8.17 8.17 0 0 1-7.47 8.25a8 8 0 0 1-8.53-8V80a32 32 0 0 0-32-32H24a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h72a24 24 0 0 1 24 23.94a7.9 7.9 0 0 0 5.12 7.55A8 8 0 0 0 136 232a24 24 0 0 1 24-24h72a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8m-24 120h-39.73a8.17 8.17 0 0 1-8.25-7.47a8 8 0 0 1 8-8.53h39.73a8.17 8.17 0 0 1 8.25 7.47a8 8 0 0 1-8 8.53m0-32h-39.73a8.17 8.17 0 0 1-8.25-7.47a8 8 0 0 1 8-8.53h39.73a8.17 8.17 0 0 1 8.25 7.47a8 8 0 0 1-8 8.53m0-32h-39.73a8.17 8.17 0 0 1-8.27-7.47a8 8 0 0 1 8-8.53h39.73a8.17 8.17 0 0 1 8.27 7.47a8 8 0 0 1-8 8.53"
						/>
					</svg>
				),
			},
			{
				title: "Installation",
				href: "/docs/installation",
				icon: () => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.2em"
						height="1.2em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							fillRule="evenodd"
							d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12m10-5.75a.75.75 0 0 1 .75.75v5.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V7a.75.75 0 0 1 .75-.75m-4 10a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z"
							clipRule="evenodd"
						/>
					</svg>
				),
			},
			{
				title: "Basic Usage",
				href: "/docs/basic-usage",
				icon: () => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.2em"
						height="1.2em"
						viewBox="0 0 16 16"
					>
						<path
							fill="currentColor"
							d="M2 3.75C2 2.784 2.784 2 3.75 2h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25zM6 6.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0zM8 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2A.5.5 0 0 0 8 8m3-2.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0z"
						></path>
					</svg>
				),
			},
			{
				title: "Comparison",
				href: "/docs/comparison",
				icon: GitCompare,
			},
			{
				title: "Migrating from LaTeX",
				href: "/docs/migration",
				icon: ArrowRightLeft,
			},
		],
	},
	{
		title: "Writing",
		Icon: PenTool,
		list: [
			{
				title: "Documents and Classes",
				href: "/docs/writing/documents",
				icon: FileText,
			},
			{
				title: "Text and Fonts",
				href: "/docs/writing/text",
				icon: Type,
			},
			{
				title: "Mathematics",
				href: "/docs/writing/mathematics",
				icon: Sigma,
			},
			{
				title: "Tables",
				href: "/docs/writing/tables",
				icon: Table,
			},
			{
				title: "Pictures and Floats",
				href: "/docs/writing/pictures",
				icon: Image,
			},
			{
				title: "References and Links",
				href: "/docs/writing/references",
				icon: Link,
			},
			{
				title: "Bibliographies",
				href: "/docs/writing/bibliographies",
				icon: Quote,
			},
			{
				title: "Languages",
				href: "/docs/writing/languages",
				icon: Languages,
			},
			{
				title: "Diagrams and Plots",
				href: "/docs/writing/diagrams",
				icon: Workflow,
			},
			{
				title: "Slides",
				href: "/docs/writing/slides",
				icon: Presentation,
			},
			{
				title: "Pages and PDF",
				href: "/docs/writing/pages",
				icon: FileType,
			},
		],
	},
	{
		title: "Packages",
		Icon: Package,
		list: [
			{
				title: "Supported Packages",
				href: "/docs/packages",
				icon: Boxes,
			},
			{
				title: "Writing Packages",
				href: "/docs/packages/writing",
				icon: PackagePlus,
			},
			{
				title: "The mtex Language",
				href: "/docs/packages/language",
				icon: Braces,
			},
		],
	},
	{
		title: "Command Line",
		Icon: Terminal,
		list: [
			{
				title: "Options",
				href: "/docs/command-line",
				icon: SquareTerminal,
			},
		],
	},
	{
		title: "Embedding",
		Icon: Plug,
		list: [
			{
				title: "Overview",
				href: "/docs/embedding",
				icon: Layers,
			},
			{
				title: "C++",
				href: "/docs/embedding/cpp",
				icon: Code,
			},
			{
				title: "C, Python and more",
				href: "/docs/embedding/c",
				icon: Binary,
			},
			{
				title: "JavaScript",
				href: "/docs/embedding/javascript",
				icon: Globe,
			},
		],
	},
	{
		title: "Help",
		Icon: LifeBuoy,
		list: [
			{
				title: "Security",
				href: "/docs/security",
				icon: ShieldCheck,
			},
			{
				title: "Performance",
				href: "/docs/performance",
				icon: Gauge,
			},
			{
				title: "Troubleshooting",
				href: "/docs/troubleshooting",
				icon: Wrench,
			},
			{
				title: "FAQ",
				href: "/docs/faq",
				icon: CircleHelp,
			},
		],
	},
];
