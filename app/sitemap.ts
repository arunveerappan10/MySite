import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/queries/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const settings = await getSettings();

  return [
    {
      url: siteUrl,
      lastModified: new Date(settings.updated_at),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
