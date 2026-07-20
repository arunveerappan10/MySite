"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export async function markEnquiryStatus(id: string, status: "new" | "read" | "archived") {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);

  if (error) {
    logger.error("Failed to update enquiry status", { error: error.message, id });
    return { error: "Failed to update. Please try again." };
  }

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  return { success: true as const };
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);

  if (error) {
    logger.error("Failed to delete enquiry", { error: error.message, id });
    return { error: "Failed to delete. Please try again." };
  }

  revalidatePath("/admin/enquiries");
  return { success: true as const };
}
