import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { SkillGroupRow } from "@/lib/types";

export const getSkillGroups = cache(async (): Promise<SkillGroupRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skill_groups")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load skill groups", { error: error.message });
    throw new Error("Unable to load skills");
  }

  return (data ?? []) as SkillGroupRow[];
});

export const getAllSkillGroupsForAdmin = cache(async (): Promise<SkillGroupRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skill_groups").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load skill groups (admin)", { error: error.message });
    throw new Error("Unable to load skills");
  }

  return (data ?? []) as SkillGroupRow[];
});

export const getSkillGroupByIdForAdmin = cache(async (id: string): Promise<SkillGroupRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skill_groups").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load skill group", { error: error.message, id });
    throw new Error("Unable to load skill group");
  }

  return data as SkillGroupRow | null;
});
