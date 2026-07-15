import * as zod from "zod";

export const schema = zod.object({
	name: zod.string().trim().min(1, "Full name is required"),
	email: zod.email("Please enter a valid email address"),
	description: zod.string().trim().min(1, "Please describe your needs"),
});
