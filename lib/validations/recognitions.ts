import { z } from "zod";
import { ICON_KEYS } from "@/lib/icon-map";

export const recognitionSchema = z.object({
  icon: z.enum(ICON_KEYS),
  title: z.string().trim().min(1, "Required").max(120),
  body: z.string().trim().min(1, "Required").max(500),
  image_url: z.string().url().nullable(),
});

export type RecognitionInput = z.infer<typeof recognitionSchema>;
