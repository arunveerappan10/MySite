import type { SectionKey } from "@/lib/constants";

/** Shared shape for jsonb `{label,value}[]` columns (hero stats, project metrics, experience highlights). */
export interface KeyValue {
  label: string;
  value: string;
}

interface Orderable {
  position: number;
  is_published: boolean;
}

interface Timestamped {
  created_at: string;
  updated_at: string;
}

export interface SettingsRow extends Pick<Timestamped, "updated_at"> {
  id: 1;
  site_title: string;
  site_description: string;
  og_image_url: string | null;
  resume_file_url: string | null;
  /** Short blurb under the name in the footer — distinct copy from profile.hero_subheading. */
  footer_bio: string;
  /** Bottom-bar signature line, e.g. "Designed with restraint". */
  footer_tagline: string;
  nav_cta_label: string;
  nav_cta_href: string;
}

export interface ProfileRow extends Pick<Timestamped, "updated_at"> {
  id: 1;
  full_name: string;
  hero_accent_word: string;
  hero_eyebrow: string;
  hero_subheading: string;
  hero_stats: KeyValue[];
  about_summary: string;
  email: string;
  phone: string | null;
  location: string | null;
  availability_note: string | null;
  contact_intro: string;
  image_url: string | null;
}

export interface SectionRow extends Timestamped {
  id: string;
  key: SectionKey;
  eyebrow: string;
  /** Supports `{{word}}` inline markup — see lib/accent-heading.ts */
  heading: string;
  nav_label: string | null;
  position: number;
  is_published: boolean;
}

export interface SocialLinkRow extends Orderable, Timestamped {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
}

export interface ProjectRow extends Orderable, Timestamped {
  id: string;
  title: string;
  tag: string;
  problem: string;
  role: string;
  approach: string;
  outcome: string;
  metrics: KeyValue[];
  image_url: string | null;
}

export interface ExperienceEntryRow extends Orderable, Timestamped {
  id: string;
  company: string;
  domain: string;
  role_title: string;
  period_label: string;
  duration_label: string;
  impact_bullets: string[];
  highlights: KeyValue[];
  tech_stack: string[];
  image_url: string | null;
}

export interface SkillGroupRow extends Orderable, Timestamped {
  id: string;
  group_name: string;
  icon: string;
  items: string[];
  image_url: string | null;
}

export interface RecognitionRow extends Orderable, Timestamped {
  id: string;
  icon: string;
  title: string;
  body: string;
  image_url: string | null;
}

export interface CertificationRow extends Orderable, Timestamped {
  id: string;
  name: string;
  issuer: string;
  credential_id: string;
  validity_label: string;
  verify_url: string | null;
  image_url: string | null;
}

export interface EducationEntryRow extends Orderable, Timestamped {
  id: string;
  school: string;
  degree: string;
  period_label: string;
  score_label: string;
  image_url: string | null;
}

export interface InterestRow extends Orderable, Timestamped {
  id: string;
  label: string;
  icon: string;
  image_url: string | null;
}

export interface TestimonialRow extends Orderable, Timestamped {
  id: string;
  author_name: string;
  author_role: string | null;
  quote: string;
  image_url: string | null;
  rating: number | null;
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  ip_hash: string | null;
  user_agent: string | null;
  turnstile_verified: boolean;
  created_at: string;
}
