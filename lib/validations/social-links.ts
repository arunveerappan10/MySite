import { z } from "zod";
import { ICON_KEYS } from "@/lib/icon-map";

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Required").max(40),
  label: z.string().trim().min(1, "Required").max(60),
  url: z.string().trim().min(1, "Required").url("Enter a valid URL"),
  icon: z.enum(ICON_KEYS),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
