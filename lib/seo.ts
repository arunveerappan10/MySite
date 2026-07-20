import type { Metadata } from "next";
import type { ProfileRow, SettingsRow, SocialLinkRow } from "@/lib/types";

export function buildMetadata(settings: SettingsRow, profile: ProfileRow): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const { site_title: title, site_description: description, og_image_url: ogImage } = settings;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    authors: [{ name: profile.full_name }],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export function buildPersonJsonLd(
  profile: ProfileRow,
  settings: SettingsRow,
  socialLinks: SocialLinkRow[],
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    url: siteUrl,
    email: profile.email,
    jobTitle: profile.hero_eyebrow,
    description: settings.site_description,
    ...(profile.image_url && { image: profile.image_url }),
    ...(profile.location && {
      address: { "@type": "PostalAddress", addressLocality: profile.location },
    }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks.map((link) => link.url) }),
  };
}
