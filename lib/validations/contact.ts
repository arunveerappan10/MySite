import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().min(1, "Required").email("Enter a valid email"),
  message: z.string().trim().min(1, "Required").max(4000),
  turnstileToken: z.string().min(1, "Verification required"),
});

export type ContactInput = z.infer<typeof contactSchema>;
