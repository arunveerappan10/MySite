import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { SocialLinkRow } from "@/lib/types";

export const getSocialLinks = cache(async (): Promise<SocialLinkRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load social links", { error: error.message });
    throw new Error("Unable to load social links");
  }

  return (data ?? []) as SocialLinkRow[];
});

export const getAllSocialLinksForAdmin = cache(async (): Promise<SocialLinkRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("social_links").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load social links (admin)", { error: error.message });
    throw new Error("Unable to load social links");
  }

  return (data ?? []) as SocialLinkRow[];
});

export const getSocialLinkByIdForAdmin = cache(async (id: string): Promise<SocialLinkRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("social_links").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load social link", { error: error.message, id });
    throw new Error("Unable to load social link");
  }

  return data as SocialLinkRow | null;
});
