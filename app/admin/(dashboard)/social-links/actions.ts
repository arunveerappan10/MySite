"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations/social-links";

export async function createSocialLink(id: string, input: SocialLinkInput) {
  await requireAdmin();

  const parsed = socialLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data: maxRow } = await supabase
    .from("social_links")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (maxRow?.position ?? 0) + 10;

  const { error } = await supabase.from("social_links").insert({ id, ...parsed.data, position });

  if (error) {
    logger.error("Failed to create social link", { error: error.message });
    return { error: "Failed to create social link. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/social-links");
  return { success: true as const, id };
}

export async function updateSocialLink(id: string, input: SocialLinkInput) {
  await requireAdmin();

  const parsed = socialLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("social_links").update(parsed.data).eq("id", id);

  if (error) {
    logger.error("Failed to update social link", { error: error.message, id });
    return { error: "Failed to save changes. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/social-links");
  return { success: true as const };
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);

  if (error) {
    logger.error("Failed to delete social link", { error: error.message, id });
    return { error: "Failed to delete. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/social-links");
  return { success: true as const };
}

export async function toggleSocialLinkPublish(id: string, isPublished: boolean) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("social_links").update({ is_published: isPublished }).eq("id", id);

  if (error) {
    logger.error("Failed to toggle social link publish", { error: error.message, id });
    return { error: "Failed to update. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/social-links");
  return { success: true as const };
}

export async function reorderSocialLinks(order: { id: string; position: number }[]) {
  await requireAdmin();

  const supabase = await createClient();
  const results = await Promise.all(
    order.map(({ id, position }) => supabase.from("social_links").update({ position }).eq("id", id)),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    logger.error("Failed to reorder social links", { error: failed.error.message });
    return { error: "Failed to save order. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/social-links");
  return { success: true as const };
}
