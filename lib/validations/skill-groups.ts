import { z } from "zod";
import { ICON_KEYS } from "@/lib/icon-map";

export const skillGroupSchema = z.object({
  group_name: z.string().trim().min(1, "Required").max(80),
  icon: z.enum(ICON_KEYS),
  items: z.array(z.string().trim().min(1).max(60)).min(1, "Add at least one item"),
  image_url: z.string().url().nullable(),
});

export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
