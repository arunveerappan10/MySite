"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { extractStoragePath } from "@/lib/storage-utils";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

interface PreviousFiles {
  ogImageUrl: string | null;
  resumeFileUrl: string | null;
}

export async function updateSettings(input: SettingsInput, previous: PreviousFiles) {
  await requireAdmin();

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("settings").update(parsed.data).eq("id", 1);

  if (error) {
    logger.error("Failed to update settings", { error: error.message });
    return { error: "Failed to save changes. Please try again." };
  }

  if (previous.ogImageUrl && previous.ogImageUrl !== parsed.data.og_image_url) {
    const path = extractStoragePath(previous.ogImageUrl, STORAGE_BUCKETS.media);
    if (path) await supabase.storage.from(STORAGE_BUCKETS.media).remove([path]);
  }

  if (previous.resumeFileUrl && previous.resumeFileUrl !== parsed.data.resume_file_url) {
    const path = extractStoragePath(previous.resumeFileUrl, STORAGE_BUCKETS.documents);
    if (path) await supabase.storage.from(STORAGE_BUCKETS.documents).remove([path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true as const };
}
