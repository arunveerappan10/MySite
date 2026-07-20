"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { extractStoragePath } from "@/lib/storage-utils";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export async function updateProfile(input: ProfileInput, previousImageUrl: string | null) {
  await requireAdmin();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profile").update(parsed.data).eq("id", 1);

  if (error) {
    logger.error("Failed to update profile", { error: error.message });
    return { error: "Failed to save changes. Please try again." };
  }

  if (previousImageUrl && previousImageUrl !== parsed.data.image_url) {
    const path = extractStoragePath(previousImageUrl, STORAGE_BUCKETS.media);
    if (path) await supabase.storage.from(STORAGE_BUCKETS.media).remove([path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true as const };
}
