import { z } from "zod";
import { keyValueSchema } from "./common";

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Required").max(120),
  tag: z.string().trim().min(1, "Required").max(60),
  problem: z.string().trim().min(1, "Required").max(2000),
  role: z.string().trim().min(1, "Required").max(500),
  approach: z.string().trim().min(1, "Required").max(2000),
  outcome: z.string().trim().min(1, "Required").max(2000),
  metrics: z.array(keyValueSchema).min(1, "Add at least one metric").max(4, "Up to 4 metrics"),
  image_url: z.string().url().nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
