import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { EnquiryRow } from "@/lib/types";

export const getAllEnquiriesForAdmin = cache(async (): Promise<EnquiryRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to load enquiries", { error: error.message });
    throw new Error("Unable to load enquiries");
  }

  return (data ?? []) as EnquiryRow[];
});

export const getEnquiryByIdForAdmin = cache(async (id: string): Promise<EnquiryRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("enquiries").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load enquiry", { error: error.message, id });
    throw new Error("Unable to load enquiry");
  }

  return data as EnquiryRow | null;
});

export const getUnreadEnquiryCount = cache(async (): Promise<number> => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    logger.error("Failed to count unread enquiries", { error: error.message });
    throw new Error("Unable to count unread enquiries");
  }

  return count ?? 0;
});
