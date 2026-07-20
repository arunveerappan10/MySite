import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceEntryRow } from "@/lib/types";

export const getExperienceEntries = cache(async (): Promise<ExperienceEntryRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience_entries")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load experience entries", { error: error.message });
    throw new Error("Unable to load experience");
  }

  return (data ?? []) as ExperienceEntryRow[];
});

export const getAllExperienceEntriesForAdmin = cache(async (): Promise<ExperienceEntryRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience_entries")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load experience entries (admin)", { error: error.message });
    throw new Error("Unable to load experience");
  }

  return (data ?? []) as ExperienceEntryRow[];
});

export const getExperienceEntryByIdForAdmin = cache(async (id: string): Promise<ExperienceEntryRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("experience_entries").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load experience entry", { error: error.message, id });
    throw new Error("Unable to load experience entry");
  }

  return data as ExperienceEntryRow | null;
});
