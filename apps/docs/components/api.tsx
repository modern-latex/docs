import { Button } from "@prostha/ui/src/components/button";
import { CodeBlock } from "@prostha/ui/src/components/code-block";
import { Link } from "lucide-react";
import { Endpoint } from "@/components/endpoint";
import { Methods } from "@/components/methods";

export type Property = {
	isOptional: boolean;
	description: string | null;
	propName: string;
	type: string;
	exampleValue: string | null;
	comments: string | null;
	isServerOnly: boolean;
	path: string[];
	isNullable: boolean;
	isClientOnly: boolean;
};

export const Api = ({
	path,
	isServerOnly,
	isClientOnly,
	isExternalOnly,
	method = "GET",
	note,
	clientOnlyNote,
	serverOnlyNote,
	client,
	server,
	parameters = [],
}: {
	path: string;
	method?: "POST" | "GET" | "DELETE" | "PUT";
	isServerOnly?: boolean;
	isClientOnly?: boolean;
	isExternalOnly?: boolean;
	clientOnlyNote?: string;
	serverOnlyNote?: string;
	note?: string;
	client: string;
	server: string;
	parameters?: Property[];
}) => {
	const tabs = path.replaceAll("/", "-");

	if (isExternalOnly) {
		return (
			<div className="border shadow-sm [&_figure]:my-0 [&_figure]:border-0 [&_figure]:shadow-none [&_figure]:rounded-none">
				{!isClientOnly && !isServerOnly && (
					<Endpoint method={method} path={path} />
				)}
				{(serverOnlyNote || note) && (
					<div className="p-3 mb-2 border-b text-sm bg-fd-muted/80 text-fd-muted-foreground">
						{note && (
							<p>
								{note
									.split(/(`[^`]+`)/g)
									.map((part, idx) =>
										part.startsWith("`") && part.endsWith("`") ? (
											<code key={idx}>{part.slice(1, -1)}</code>
										) : (
											<span key={idx}>{part}</span>
										),
									)}
							</p>
						)}
						{serverOnlyNote && (
							<p className="mt-1">
								{serverOnlyNote
									.split(/(`[^`]+`)/g)
									.map((part, idx) =>
										part.startsWith("`") && part.endsWith("`") ? (
											<code key={idx}>{part.slice(1, -1)}</code>
										) : (
											<span key={idx}>{part}</span>
										),
									)}
							</p>
						)}
					</div>
				)}
				<div className="relative w-full">
					<CodeBlock code={server} language="ts" allowCopy={!isClientOnly} />
					{isClientOnly && (
						<div className="flex absolute inset-0 justify-center items-center backdrop-brightness-50 backdrop-blur-xs border text-sm">
							<span>This is a client-only endpoint</span>
						</div>
					)}
				</div>
				{parameters.filter(
					(property) => !property.isClientOnly && property.path.length === 0,
				).length > 0 && (
					<div className="mt-0">
						<div className="flex items-center gap-2 px-3.5 py-2 border-y border-border bg-fd-muted/80 text-xs text-muted-foreground">
							<span className="font-medium tracking-wider">Parameters</span>
						</div>
						<div className="divide-y divide-border">
							{parameters
								.filter(
									(property) =>
										!property.isClientOnly && property.path.length === 0,
								)
								.map((property) => (
									<div key={property.propName} className="px-3.5 py-3">
										<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
											<code className="font-semibold text-foreground/90">
												{property.propName}
											</code>
											<span className="font-mono text-foreground/60">
												{property.type}
												{property.isNullable ? " | null" : ""}
											</span>
											{!property.isOptional && (
												<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
													required
												</span>
											)}
											{property.isServerOnly && (
												<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
													server
												</span>
											)}
										</div>
										{property.description && (
											<p className="mt-1 text-sm text-fd-muted-foreground">
												{property.description
													.split(/(`[^`]+`)/g)
													.map((part, idx) =>
														part.startsWith("`") && part.endsWith("`") ? (
															<code key={idx}>{part.slice(1, -1)}</code>
														) : (
															<span key={idx}>{part}</span>
														),
													)}
											</p>
										)}
										{parameters.filter(
											(child) =>
												child.path.length > property.path.length &&
												child.path[property.path.length] === property.propName,
										).length > 0 && (
											<div className="mt-3 border rounded-md overflow-hidden bg-fd-muted/30">
												<div className="divide-y divide-border">
													{parameters
														.filter(
															(child) =>
																child.path.length > property.path.length &&
																child.path[property.path.length] ===
																	property.propName,
														)
														.map((sub) => (
															<div
																key={sub.propName}
																className="px-3 py-3 pb-3"
															>
																<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
																	<code className="font-semibold text-foreground/90">
																		{sub.propName}
																	</code>
																	<span className="font-mono text-foreground/60">
																		{sub.type}
																		{sub.isNullable ? " | null" : ""}
																	</span>
																	{!sub.isOptional && (
																		<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
																			required
																		</span>
																	)}
																	{sub.isServerOnly && (
																		<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
																			server
																		</span>
																	)}
																</div>
																{sub.description && (
																	<p className="mt-1 text-sm text-fd-muted-foreground">
																		{sub.description
																			.split(/(`[^`]+`)/g)
																			.map((part, idx) =>
																				part.startsWith("`") &&
																				part.endsWith("`") ? (
																					<code key={idx}>
																						{part.slice(1, -1)}
																					</code>
																				) : (
																					<span key={idx}>{part}</span>
																				),
																			)}
																	</p>
																)}
															</div>
														))}
												</div>
											</div>
										)}
									</div>
								))}
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<>
			<div className="relative">
				<div
					id={`api-method${tabs}`}
					aria-hidden
					className="absolute invisible -top-25"
				/>
			</div>
			<Methods
				defaultValue={isServerOnly ? "server" : "client"}
				className="gap-0 w-full"
			>
				<Methods.List className="relative flex justify-start w-full p-0 bg-background">
					{(["client", "server"] as const).map((tab) => (
						<Methods.Trigger
							key={tab}
							value={tab}
							className="max-w-25 border rounded-none data-[state=active]:bg-fd-muted/80"
						>
							<span className="capitalize">{tab}</span>
						</Methods.Trigger>
					))}
					<div className="absolute right-0">
						<a href={`#api-method${tabs}`}>
							<Button variant="ghost" size="icon" className="scale-90">
								<Link className="size-4" />
							</Button>
						</a>
					</div>
				</Methods.List>
				<Methods.Content value="client">
					<div className="border shadow-sm [&_figure]:my-0 [&_figure]:border-0 [&_figure]:shadow-none [&_figure]:rounded-none">
						{!isClientOnly && !isServerOnly && (
							<Endpoint method={method} path={path} />
						)}
						{(clientOnlyNote || note) && (
							<div className="p-3 mb-2 border-b text-sm bg-fd-muted/80 text-fd-muted-foreground">
								{note && (
									<p>
										{note
											.split(/(`[^`]+`)/g)
											.map((part, idx) =>
												part.startsWith("`") && part.endsWith("`") ? (
													<code key={idx}>{part.slice(1, -1)}</code>
												) : (
													<span key={idx}>{part}</span>
												),
											)}
									</p>
								)}
								{clientOnlyNote && (
									<p className="mt-1">
										{clientOnlyNote
											.split(/(`[^`]+`)/g)
											.map((part, idx) =>
												part.startsWith("`") && part.endsWith("`") ? (
													<code key={idx}>{part.slice(1, -1)}</code>
												) : (
													<span key={idx}>{part}</span>
												),
											)}
									</p>
								)}
							</div>
						)}
						<div className="relative w-full">
							<CodeBlock
								code={client}
								language="ts"
								allowCopy={!isServerOnly}
							/>
							{isServerOnly && (
								<div className="flex absolute inset-0 justify-center items-center backdrop-brightness-50 backdrop-blur-xs border text-sm">
									<span>This is a server-only endpoint</span>
								</div>
							)}
						</div>
						{parameters.filter(
							(property) =>
								!property.isServerOnly && property.path.length === 0,
						).length > 0 && (
							<div className="mt-0">
								<div className="flex items-center gap-2 px-3.5 py-2 border-y border-border bg-fd-muted/80 text-xs text-muted-foreground">
									<span className="font-medium tracking-wider">Parameters</span>
								</div>
								<div className="divide-y divide-border">
									{parameters
										.filter(
											(property) =>
												!property.isServerOnly && property.path.length === 0,
										)
										.map((property) => (
											<div key={property.propName} className="px-3.5 py-3">
												<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
													<code className="font-semibold text-foreground/90">
														{property.propName}
													</code>
													<span className="font-mono text-foreground/60">
														{property.type}
														{property.isNullable ? " | null" : ""}
													</span>
													{!property.isOptional && (
														<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
															required
														</span>
													)}
													{property.isServerOnly && (
														<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
															server
														</span>
													)}
												</div>
												{property.description && (
													<p className="mt-1 text-sm text-fd-muted-foreground">
														{property.description
															.split(/(`[^`]+`)/g)
															.map((part, idx) =>
																part.startsWith("`") && part.endsWith("`") ? (
																	<code key={idx}>{part.slice(1, -1)}</code>
																) : (
																	<span key={idx}>{part}</span>
																),
															)}
													</p>
												)}
												{parameters.filter(
													(child) =>
														child.path.length > property.path.length &&
														child.path[property.path.length] ===
															property.propName,
												).length > 0 && (
													<div className="mt-3 border rounded-md overflow-hidden bg-fd-muted/30">
														<div className="divide-y divide-border">
															{parameters
																.filter(
																	(child) =>
																		child.path.length > property.path.length &&
																		child.path[property.path.length] ===
																			property.propName,
																)
																.map((sub) => (
																	<div
																		key={sub.propName}
																		className="px-3 py-3 pb-3"
																	>
																		<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
																			<code className="font-semibold text-foreground/90">
																				{sub.propName}
																			</code>
																			<span className="font-mono text-foreground/60">
																				{sub.type}
																				{sub.isNullable ? " | null" : ""}
																			</span>
																			{!sub.isOptional && (
																				<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
																					required
																				</span>
																			)}
																			{sub.isServerOnly && (
																				<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
																					server
																				</span>
																			)}
																		</div>
																		{sub.description && (
																			<p className="mt-1 text-sm text-fd-muted-foreground">
																				{sub.description
																					.split(/(`[^`]+`)/g)
																					.map((part, idx) =>
																						part.startsWith("`") &&
																						part.endsWith("`") ? (
																							<code key={idx}>
																								{part.slice(1, -1)}
																							</code>
																						) : (
																							<span key={idx}>{part}</span>
																						),
																					)}
																			</p>
																		)}
																	</div>
																))}
														</div>
													</div>
												)}
											</div>
										))}
								</div>
							</div>
						)}
					</div>
				</Methods.Content>
				<Methods.Content value="server">
					<div className="border shadow-sm [&_figure]:my-0 [&_figure]:border-0 [&_figure]:shadow-none [&_figure]:rounded-none">
						{!isClientOnly && !isServerOnly && (
							<Endpoint method={method} path={path} />
						)}
						{(serverOnlyNote || note) && (
							<div className="p-3 mb-2 border-b text-sm bg-fd-muted/80 text-fd-muted-foreground">
								{note && (
									<p>
										{note
											.split(/(`[^`]+`)/g)
											.map((part, idx) =>
												part.startsWith("`") && part.endsWith("`") ? (
													<code key={idx}>{part.slice(1, -1)}</code>
												) : (
													<span key={idx}>{part}</span>
												),
											)}
									</p>
								)}
								{serverOnlyNote && (
									<p className="mt-1">
										{serverOnlyNote
											.split(/(`[^`]+`)/g)
											.map((part, idx) =>
												part.startsWith("`") && part.endsWith("`") ? (
													<code key={idx}>{part.slice(1, -1)}</code>
												) : (
													<span key={idx}>{part}</span>
												),
											)}
									</p>
								)}
							</div>
						)}
						<div className="relative w-full">
							<CodeBlock
								code={server}
								language="ts"
								allowCopy={!isClientOnly}
							/>
							{isClientOnly && (
								<div className="flex absolute inset-0 justify-center items-center backdrop-brightness-50 backdrop-blur-xs border text-sm">
									<span>This is a client-only endpoint</span>
								</div>
							)}
						</div>
						{parameters.filter(
							(property) =>
								!property.isClientOnly && property.path.length === 0,
						).length > 0 && (
							<div className="mt-0">
								<div className="flex items-center gap-2 px-3.5 py-2 border-y border-border bg-fd-muted/80 text-xs text-muted-foreground">
									<span className="font-medium tracking-wider">Parameters</span>
								</div>
								<div className="divide-y divide-border">
									{parameters
										.filter(
											(property) =>
												!property.isClientOnly && property.path.length === 0,
										)
										.map((property) => (
											<div key={property.propName} className="px-3.5 py-3">
												<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
													<code className="font-semibold text-foreground/90">
														{property.propName}
													</code>
													<span className="font-mono text-foreground/60">
														{property.type}
														{property.isNullable ? " | null" : ""}
													</span>
													{!property.isOptional && (
														<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
															required
														</span>
													)}
													{property.isServerOnly && (
														<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
															server
														</span>
													)}
												</div>
												{property.description && (
													<p className="mt-1 text-sm text-fd-muted-foreground">
														{property.description
															.split(/(`[^`]+`)/g)
															.map((part, idx) =>
																part.startsWith("`") && part.endsWith("`") ? (
																	<code key={idx}>{part.slice(1, -1)}</code>
																) : (
																	<span key={idx}>{part}</span>
																),
															)}
													</p>
												)}
												{parameters.filter(
													(child) =>
														child.path.length > property.path.length &&
														child.path[property.path.length] ===
															property.propName,
												).length > 0 && (
													<div className="mt-3 border rounded-md overflow-hidden bg-fd-muted/30">
														<div className="divide-y divide-border">
															{parameters
																.filter(
																	(child) =>
																		child.path.length > property.path.length &&
																		child.path[property.path.length] ===
																			property.propName,
																)
																.map((sub) => (
																	<div
																		key={sub.propName}
																		className="px-3 py-3 pb-3"
																	>
																		<div className="flex items-center gap-2 flex-wrap text-xs font-medium">
																			<code className="font-semibold text-foreground/90">
																				{sub.propName}
																			</code>
																			<span className="font-mono text-foreground/60">
																				{sub.type}
																				{sub.isNullable ? " | null" : ""}
																			</span>
																			{!sub.isOptional && (
																				<span className="text-[10px] font-mono text-amber-600 dark:text-amber-500/80">
																					required
																				</span>
																			)}
																			{sub.isServerOnly && (
																				<span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/80">
																					server
																				</span>
																			)}
																		</div>
																		{sub.description && (
																			<p className="mt-1 text-sm text-fd-muted-foreground">
																				{sub.description
																					.split(/(`[^`]+`)/g)
																					.map((part, idx) =>
																						part.startsWith("`") &&
																						part.endsWith("`") ? (
																							<code key={idx}>
																								{part.slice(1, -1)}
																							</code>
																						) : (
																							<span key={idx}>{part}</span>
																						),
																					)}
																			</p>
																		)}
																	</div>
																))}
														</div>
													</div>
												)}
											</div>
										))}
								</div>
							</div>
						)}
					</div>
				</Methods.Content>
			</Methods>
		</>
	);
};
