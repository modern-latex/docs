import { NextResponse } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

import { schema } from "@/lib/contact";

let ratelimit: Ratelimit | null = null;

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Record<string, unknown>;

		if (typeof body?.hp === "string" && body.hp) {
			return NextResponse.json({});
		}

		if (process.env.NODE_ENV === "production") {
			ratelimit ??= new Ratelimit({
				redis: new Redis({
					url: process.env.UPSTASH_REDIS_REST_URL!,
					token: process.env.UPSTASH_REDIS_REST_TOKEN!,
				}),
				limiter: Ratelimit.slidingWindow(5, "1 h"),
				prefix: "contact-form",
			});

			if (
				!(
					await ratelimit.limit(
						request.headers.get("x-real-ip")?.trim() ||
							request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
							"unknown",
					)
				).success
			) {
				return NextResponse.json(
					{ message: "Too many requests. Please try again later." },
					{ status: 429 },
				);
			}
		}

		const payload = schema.safeParse(body);
		if (!payload.success) {
			const firstIssuePath = payload.error.issues[0]?.path[0];
			return NextResponse.json(
				{
					message:
						firstIssuePath === "email"
							? "Please enter a valid email address"
							: "Missing required fields",
				},
				{ status: firstIssuePath === "email" ? 422 : 400 },
			);
		}

		const { name, email, description } = payload.data;

		if (!process.env.SUPPORT_EMAIL || !process.env.RESEND_API_KEY) {
			console.error("Missing SUPPORT_EMAIL or RESEND_API_KEY");
			return NextResponse.json(
				{ message: "Server configuration error" },
				{ status: 500 },
			);
		}

		const resend = new Resend(process.env.RESEND_API_KEY);

		const emails = await Promise.all([
			resend.emails
				.send({
					from: "Support Team <support@prostha.org>",
					to: process.env.SUPPORT_EMAIL,
					subject: `Contact Inquiry from ${name}`,
					html: `
                   <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                     <h2 style="color: #18181b;">New Contact Form Submission</h2>
                     <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                       <p><strong>Name:</strong> ${name.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m] ?? m)}</p>
                       <p><strong>Email:</strong> ${email.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m] ?? m)}</p>
                       ${description ? `<p><strong>Message:</strong><br/>${description.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m] ?? m).replace(/\n/g, "<br/>")}</p>` : ""}
                     </div>
                     <p style="color: #71717a; font-size: 12px;">
                       Submitted: ${new Date().toLocaleString()}<br/>
                       User Agent: ${(request.headers.get("user-agent") || "N/A").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m] ?? m)}<br/>
                       Referer: ${(request.headers.get("referer") || "N/A").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m] ?? m)}
                     </p>
                   </div>
                `,
				})
				.catch((error) => ({ error, data: null })),
			resend.emails
				.send({
					from: "Support Team <support@prostha.org>",
					to: email,
					cc: process.env.SUPPORT_EMAIL,
					subject: "Re: Contact Inquiry",
					text: `Hi ${name.trim().split(/\s+/)[0] || "there"},
					Thanks for reaching out. 
					We've received your message and someone from our team will follow up shortly.
					  
					Best,
					Prostha's Support Team`,
				})
				.catch((error) => ({ error, data: null })),
		]).then(([primary, secondary]) => ({ primary, secondary }));

		if (emails.primary.error) {
			console.error(
				"Resend internal email failed (email=%s)",
				email,
				emails.primary.error,
			);
			return NextResponse.json(
				{ message: "Something went wrong. Please try again." },
				{ status: 500 },
			);
		}

		if (emails.secondary.error) {
			console.error(
				"Resend acknowledgement email failed (email=%s)",
				email,
				emails.secondary.error,
			);
		}

		return NextResponse.json({});
	} catch (error) {
		console.error("Contact form error", error);
		return NextResponse.json(
			{ message: "Something went wrong. Please try again." },
			{ status: 500 },
		);
	}
}
