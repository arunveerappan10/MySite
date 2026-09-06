import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { SectionKey } from "@/lib/constants";
import type { SectionRow } from "@/lib/types";

/** cache()'d so layout.tsx and page.tsx can both call this per-request with one network call. */
export const getSections = cache(async (): Promise<SectionRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load sections", { error: error.message });
    throw new Error("Unable to load page sections");
  }

  return (data ?? []) as SectionRow[];
});

/** Admin variant: all 10 rows regardless of is_published, for the Sections editor. */
export const getAllSectionsForAdmin = cache(async (): Promise<SectionRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load sections (admin)", { error: error.message });
    throw new Error("Unable to load page sections");
  }

  return (data ?? []) as SectionRow[];
});

/** Tables backing each content-driven section. `about` and `contact` are omitted: they
 * render from the profile/settings singletons and are never empty. */
const SECTION_SOURCE_TABLES = {
  work: "projects",
  experience: "experience_entries",
  skills: "skill_groups",
  recognition: "recognitions",
  testimonials: "testimonials",
  certifications: "certifications",
  education: "education_entries",
  interests: "interests",
} as const;

export type SectionItemCounts = Partial<Record<SectionKey, number>>;

/** Published-row count per section, so the Sections editor can flag one that is switched
 * on but has nothing to render — every section component returns null when its collection
 * is empty, which otherwise looks like the toggle is broken. Counts `is_published` rows
 * only, matching what the public queries actually fetch. */
export const getSectionItemCounts = cache(async (): Promise<SectionItemCounts> => {
  const supabase = await createClient();

  const entries = await Promise.all(
    Object.entries(SECTION_SOURCE_TABLES).map(async ([key, table]) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      if (error) {
        logger.error("Failed to count section items", { error: error.message, table });
        return null;
      }
      return [key as SectionKey, count ?? 0] as const;
    }),
  );

  return Object.fromEntries(entries.filter((e) => e !== null));
});
