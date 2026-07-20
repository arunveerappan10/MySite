import { z } from "zod";

export const settingsSchema = z.object({
  site_title: z.string().trim().min(1, "Required").max(120),
  site_description: z.string().trim().min(1, "Required").max(300),
  footer_bio: z.string().trim().min(1, "Required").max(300),
  footer_tagline: z.string().trim().min(1, "Required").max(80),
  nav_cta_label: z.string().trim().min(1, "Required").max(40),
  nav_cta_href: z.string().trim().min(1, "Required").max(200),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
