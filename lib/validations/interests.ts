import { z } from "zod";
import { ICON_KEYS } from "@/lib/icon-map";

export const interestSchema = z.object({
  label: z.string().trim().min(1, "Required").max(60),
  icon: z.enum(ICON_KEYS),
  image_url: z.string().url().nullable(),
});

export type InterestInput = z.infer<typeof interestSchema>;
