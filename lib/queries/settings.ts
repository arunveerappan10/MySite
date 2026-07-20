import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { SettingsRow } from "@/lib/types";

/** cache()'d so layout.tsx and page.tsx can both call this per-request with one network call. */
export const getSettings = cache(async (): Promise<SettingsRow> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();

  if (error || !data) {
    logger.error("Failed to load settings", { error: error?.message });
    throw new Error("Unable to load site settings");
  }

  return data as SettingsRow;
});
