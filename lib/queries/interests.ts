import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { InterestRow } from "@/lib/types";

export const getInterests = cache(async (): Promise<InterestRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interests")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load interests", { error: error.message });
    throw new Error("Unable to load interests");
  }

  return (data ?? []) as InterestRow[];
});

export const getAllInterestsForAdmin = cache(async (): Promise<InterestRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("interests").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load interests (admin)", { error: error.message });
    throw new Error("Unable to load interests");
  }

  return (data ?? []) as InterestRow[];
});

export const getInterestByIdForAdmin = cache(async (id: string): Promise<InterestRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("interests").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load interest", { error: error.message, id });
    throw new Error("Unable to load interest");
  }

  return data as InterestRow | null;
});
