"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logger } from "@/lib/logger";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { extractStoragePath } from "@/lib/storage-utils";
import { createClient } from "@/lib/supabase/server";
import { educationEntrySchema, type EducationEntryInput } from "@/lib/validations/education";

async function removeImageIfReplaced(
  supabase: Awaited<ReturnType<typeof createClient>>,
  oldUrl: string | null,
  newUrl: string | null,
) {
  if (!oldUrl || oldUrl === newUrl) return;
  const path = extractStoragePath(oldUrl, STORAGE_BUCKETS.media);
  if (path) await supabase.storage.from(STORAGE_BUCKETS.media).remove([path]);
}

export async function createEducationEntry(id: string, input: EducationEntryInput) {
  await requireAdmin();

  const parsed = educationEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from("education_entries")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (maxRow?.position ?? 0) + 10;

  const { error } = await supabase.from("education_entries").insert({ id, ...parsed.data, position });

  if (error) {
    logger.error("Failed to create education entry", { error: error.message });
    return { error: "Failed to create entry. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true as const, id };
}

export async function updateEducationEntry(id: string, input: EducationEntryInput, previousImageUrl: string | null) {
  await requireAdmin();

  const parsed = educationEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("education_entries").update(parsed.data).eq("id", id);

  if (error) {
    logger.error("Failed to update education entry", { error: error.message, id });
    return { error: "Failed to save changes. Please try again." };
  }

  await removeImageIfReplaced(supabase, previousImageUrl, parsed.data.image_url);

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true as const };
}

export async function deleteEducationEntry(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { data: existing } = await supabase.from("education_entries").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("education_entries").delete().eq("id", id);

  if (error) {
    logger.error("Failed to delete education entry", { error: error.message, id });
    return { error: "Failed to delete. Please try again." };
  }

  if (existing?.image_url) {
    const path = extractStoragePath(existing.image_url, STORAGE_BUCKETS.media);
    if (path) await supabase.storage.from(STORAGE_BUCKETS.media).remove([path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true as const };
}

export async function toggleEducationEntryPublish(id: string, isPublished: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("education_entries").update({ is_published: isPublished }).eq("id", id);

  if (error) {
    logger.error("Failed to toggle education entry publish", { error: error.message, id });
    return { error: "Failed to update. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true as const };
}

export async function reorderEducationEntries(order: { id: string; position: number }[]) {
  await requireAdmin();

  const supabase = await createClient();
  const results = await Promise.all(
    order.map(({ id, position }) => supabase.from("education_entries").update({ position }).eq("id", id)),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    logger.error("Failed to reorder education entries", { error: failed.error.message });
    return { error: "Failed to save order. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true as const };
}
