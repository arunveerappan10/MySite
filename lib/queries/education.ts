import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { EducationEntryRow } from "@/lib/types";

export const getEducationEntries = cache(async (): Promise<EducationEntryRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("education_entries")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load education entries", { error: error.message });
    throw new Error("Unable to load education");
  }

  return (data ?? []) as EducationEntryRow[];
});

export const getAllEducationEntriesForAdmin = cache(async (): Promise<EducationEntryRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("education_entries").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load education entries (admin)", { error: error.message });
    throw new Error("Unable to load education");
  }

  return (data ?? []) as EducationEntryRow[];
});

export const getEducationEntryByIdForAdmin = cache(async (id: string): Promise<EducationEntryRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("education_entries").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load education entry", { error: error.message, id });
    throw new Error("Unable to load education entry");
  }

  return data as EducationEntryRow | null;
});
