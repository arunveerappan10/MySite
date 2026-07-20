import { z } from "zod";
import { keyValueSchema } from "./common";

export const profileSchema = z
  .object({
    full_name: z.string().trim().min(1, "Required").max(120),
    hero_accent_word: z.string().trim().min(1, "Required").max(60),
    hero_eyebrow: z.string().trim().min(1, "Required").max(120),
    hero_subheading: z.string().trim().min(1, "Required").max(500),
    hero_stats: z.array(keyValueSchema).max(6, "Up to 6 stats"),
    about_summary: z.string().trim().min(1, "Required").max(2000),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().max(40).nullable().optional(),
    location: z.string().trim().max(160).nullable().optional(),
    availability_note: z.string().trim().max(80).nullable().optional(),
    contact_intro: z.string().trim().min(1, "Required").max(500),
    image_url: z.string().url().nullable(),
  })
  .refine((data) => data.full_name.includes(data.hero_accent_word), {
    message: "Must be an exact substring of the full name (case-sensitive) so it renders italicized correctly.",
    path: ["hero_accent_word"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
