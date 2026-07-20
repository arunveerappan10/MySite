import { z } from "zod";
import { keyValueSchema } from "./common";

export const experienceEntrySchema = z.object({
  company: z.string().trim().min(1, "Required").max(120),
  domain: z.string().trim().min(1, "Required").max(120),
  role_title: z.string().trim().min(1, "Required").max(120),
  period_label: z.string().trim().min(1, "Required").max(60),
  duration_label: z.string().trim().min(1, "Required").max(60),
  impact_bullets: z.array(z.string().trim().min(1).max(300)).min(1, "Add at least one bullet"),
  highlights: z.array(keyValueSchema).max(6, "Up to 6 highlights"),
  tech_stack: z.array(z.string().trim().min(1).max(40)).max(20, "Up to 20 items"),
  image_url: z.string().url().nullable(),
});

export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
