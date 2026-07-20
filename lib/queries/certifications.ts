import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { CertificationRow } from "@/lib/types";

export const getCertifications = cache(async (): Promise<CertificationRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load certifications", { error: error.message });
    throw new Error("Unable to load certifications");
  }

  return (data ?? []) as CertificationRow[];
});

export const getAllCertificationsForAdmin = cache(async (): Promise<CertificationRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("certifications").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load certifications (admin)", { error: error.message });
    throw new Error("Unable to load certifications");
  }

  return (data ?? []) as CertificationRow[];
});

export const getCertificationByIdForAdmin = cache(async (id: string): Promise<CertificationRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("certifications").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load certification", { error: error.message, id });
    throw new Error("Unable to load certification");
  }

  return data as CertificationRow | null;
});
