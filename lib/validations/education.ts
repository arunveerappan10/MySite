import { z } from "zod";

export const educationEntrySchema = z.object({
  school: z.string().trim().min(1, "Required").max(160),
  degree: z.string().trim().min(1, "Required").max(160),
  period_label: z.string().trim().min(1, "Required").max(60),
  score_label: z.string().trim().min(1, "Required").max(60),
  image_url: z.string().url().nullable(),
});

export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
