import { ImageResponse } from "@vercel/og";
import * as zod from "zod";

export const runtime = "edge";

export async function GET(request: Request) {
	try {
		const schema = zod
			.object({
				heading: zod.string().default("Prostha Update"),
				description: zod.string().optional(),
				date: zod.string().optional(),
			})
			.parse(Object.fromEntries(new URL(request.url).searchParams));

		return new ImageResponse(
			<div
				tw="flex w-full h-full relative flex-col"
				style={{
					background: "#000000",
					color: "white",
				}}
			>
				<div
					tw="flex w-full h-full absolute"
					style={{
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						borderRadius: "10px",
						border: "1px solid rgba(32, 34, 34, 0.5)",
					}}
				/>
				<div
					tw="absolute"
					style={{
						width: "350px",
						height: "120px",
						borderRadius: "100px",
						background: "#c7c7c7",
						opacity: 0.15,
						filter: "blur(35px)",
						transform: "rotate(50deg)",
						top: "18%",
						left: "0%",
					}}
				/>
				<div
					tw="absolute w-full h-full"
					style={{
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 25 25'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.12)'/%3E%3C/svg%3E\")",
						backgroundRepeat: "repeat",
					}}
				/>
				<div
					tw="absolute w-full h-px"
					style={{
						top: "10%",
						background: "linear-gradient(90deg, #888888 30%, #1d1f1f 70%)",
					}}
				/>
				<div
					tw="absolute w-full h-px"
					style={{ bottom: "10%", background: "#2c2c2c" }}
				/>
				<div
					tw="absolute h-full w-px"
					style={{
						left: "10%",
						background: "linear-gradient(180deg, #747474 30%, #222424 70%)",
					}}
				/>
				<div
					tw="absolute h-full w-px"
					style={{ right: "10%", background: "#2c2c2c" }}
				/>

				<div
					tw="flex flex-col w-full h-full p-12 relative"
					style={{
						paddingLeft: "170px",
						paddingTop: "140px",
					}}
				>
					<div
						tw="flex text-6xl font-bold"
						style={{ color: "#ffffff", marginBottom: "24px" }}
					>
						{schema.heading.length > 140
							? `${schema.heading.substring(0, 140)}...`
							: schema.heading}
					</div>

					{schema.description && (
						<div
							tw="flex text-2xl"
							style={{ color: "#d4d4d8", opacity: 0.8, marginBottom: "16px" }}
						>
							{schema.description}
						</div>
					)}

					{schema.date && (
						<div tw="flex text-2xl" style={{ color: "#a1a1aa", opacity: 0.6 }}>
							{schema.date}
						</div>
					)}
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Geist",
						data: await fetch(
							new URL("../../../assets/Geist.ttf", import.meta.url),
						).then((res) => res.arrayBuffer()),
						weight: 400,
						style: "normal",
					},
				],
			},
		);
	} catch {
		return new Response("Failed to generate the OG image", { status: 500 });
	}
}
