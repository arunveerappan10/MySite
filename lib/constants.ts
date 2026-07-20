export const STORAGE_BUCKETS = {
  media: "media",
  documents: "documents",
} as const;

export const SECTION_KEYS = [
  "about",
  "work",
  "experience",
  "skills",
  "recognition",
  "testimonials",
  "certifications",
  "education",
  "interests",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

/** Mutable tuple (not `as const`) — Framer Motion's `Easing` type rejects readonly tuples. */
export const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const RATE_LIMIT = {
  windowMinutes: 10,
  maxRequests: 3,
  route: "contact",
} as const;

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "Twitter",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  dribbble: "Dribbble",
  behance: "Behance",
  medium: "Medium",
  website: "Website",
};

export function platformLabel(platform: string): string {
  return PLATFORM_LABELS[platform.toLowerCase()] ?? platform.charAt(0).toUpperCase() + platform.slice(1);
}
