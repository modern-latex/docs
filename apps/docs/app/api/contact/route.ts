"use client";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIP } from "@/lib/ai-chat/rate-limit";
import { schema } from "@/lib/contact";

let ratelimit: Ratelimit | null = null;

export async function POST(request: Request) {
	try {
		const body = await request.json() as Record<string, unknown>;

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

			if (!(await ratelimit.limit(getClientIP(request))).success) {
				return NextResponse.json(
					{ message: "Too many requests. Please try again later." },
					{ status: 429 },
				);
			}
		}

		const payload = schema.safeParse(body);
		if (!payload.success) {
			return NextResponse.json(
				{ message: payload.error.issues[0]?.path[0] === "email" ? "Please enter a valid email address" : "Missing required fields" },
				{ status: payload.error.issues[0]?.path[0] === "email" ? 422 : 400 },
			);
		}

		const { fullName, email, description } = payload.data;

		if (!process.env.SUPPORT_EMAIL || !process.env.RESEND_API_KEY) {
			console.error("Missing SUPPORT_EMAIL or RESEND_API_KEY");
			return NextResponse.json(
				{ message: "Server configuration error" },
				{ status: 500 },
			);
		}

		const resend = new Resend(process.env.RESEND_API_KEY);
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		};

		const [internalResult, acknowledgementResult] = await Promise.all([
			resend.emails.send({
				from: "Support Team <support@prosthaphaeresis.com>",
				to: process.env.SUPPORT_EMAIL,
				subject: `Contact Inquiry from ${fullName}`,
				html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                   <h2 style="color: #18181b;">New Contact Form Submission</h2>
                   <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p><strong>Name:</strong> ${fullName.replace(/[&<>"']/g, (entity) => entities[entity] ?? entity)}</p>
                      <p><strong>Email:</strong> ${email.replace(/[&<>"']/g, (entity) => entities[entity] ?? entity)}</p>
                      ${description ? `<p><strong>Message:</strong><br/>${description.replace(/[&<>"']/g, (entity) => entities[entity] ?? entity).replace(/\n/g, "<br/>")}</p>` : ""}
                   </div>
                   <p style="color: #71717a; font-size: 12px;">
                      Submitted: ${new Date().toLocaleString()}<br/>
                      User Agent: ${(request.headers.get("user-agent") || "N/A").replace(/[&<>"']/g, (entity) => entities[entity] ?? entity)}<br/>
                      Referer: ${(request.headers.get("referer") || "N/A").replace(/[&<>"']/g, (entity) => entities[entity] ?? entity)}
                   </p>
                </div>
             `,
			}),
			resend.emails.send({
				from: "Support Team <support@prosthaphaeresis.com>",
				to: email,
				cc: process.env.SUPPORT_EMAIL,
				subject: "Re: Contact Inquiry",
				text: `Hi ${fullName.trim().split(/\s+/)[0] || "there"},
             Thanks for reaching out. 
             We've received your message and someone from our team will follow up shortly.
             
             Best,
             Prostha's Support Team`,
			}).catch((err) => ({ error: err, data: null })),
		]);

		if (internalResult.error) {
			console.error("Resend internal email failed (email=%s)", email, internalResult.error);
			return NextResponse.json(
				{ message: "Something went wrong. Please try again." },
				{ status: 500 },
			);
		}

		if (acknowledgementResult.error) {
			console.error("Resend acknowledgement email failed (email=%s)", email, acknowledgementResult.error);
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