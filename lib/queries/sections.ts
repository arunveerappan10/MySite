import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
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
