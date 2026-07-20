import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { getProfile } from "@/lib/queries/profile";
import { getSections } from "@/lib/queries/sections";
import { getSettings } from "@/lib/queries/settings";
import { getSocialLinks } from "@/lib/queries/social-links";
import { buildMetadata, buildPersonJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()]);
  return buildMetadata(settings, profile);
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [sections, settings, profile, socialLinks] = await Promise.all([
    getSections(),
    getSettings(),
    getProfile(),
    getSocialLinks(),
  ]);

  const personJsonLd = buildPersonJsonLd(profile, settings, socialLinks);

  return (
    <MotionProvider>
      <div className="min-h-screen bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteNav sections={sections} settings={settings} profile={profile} />
        <main className="mx-auto max-w-6xl px-6 md:px-10">{children}</main>
        <SiteFooter sections={sections} settings={settings} profile={profile} />
      </div>
    </MotionProvider>
  );
}
