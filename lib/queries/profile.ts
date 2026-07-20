import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/types";

/** cache()'d so layout.tsx and page.tsx can both call this per-request with one network call. */
export const getProfile = cache(async (): Promise<ProfileRow> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profile").select("*").eq("id", 1).single();

  if (error || !data) {
    logger.error("Failed to load profile", { error: error?.message });
    throw new Error("Unable to load profile content");
  }

  return data as ProfileRow;
});
