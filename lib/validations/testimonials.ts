import { z } from "zod";

export const testimonialSchema = z.object({
  author_name: z.string().trim().min(1, "Required").max(120),
  author_role: z.string().trim().max(120).nullable(),
  quote: z.string().trim().min(1, "Required").max(1000),
  image_url: z.string().url().nullable(),
  rating: z.number().int().min(1).max(5).nullable(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
