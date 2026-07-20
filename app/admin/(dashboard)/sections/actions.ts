"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import {
  sectionEditSchema,
  sectionsReorderSchema,
  type SectionEditInput,
} from "@/lib/validations/sections";

export async function updateSectionCopy(input: SectionEditInput) {
  await requireAdmin();

  const parsed = sectionEditSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { id, ...fields } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update(fields).eq("id", id);

  if (error) {
    logger.error("Failed to update section", { error: error.message, id });
    return { error: "Failed to save changes. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { success: true as const };
}

export async function reorderSections(order: { id: string; position: number }[]) {
  await requireAdmin();

  const parsed = sectionsReorderSchema.safeParse(order);
  if (!parsed.success) {
    return { error: "Invalid reorder payload" };
  }

  const supabase = await createClient();
  const results = await Promise.all(
    parsed.data.map(({ id, position }) =>
      supabase.from("sections").update({ position }).eq("id", id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    logger.error("Failed to reorder sections", { error: failed.error.message });
    return { error: "Failed to save order. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { success: true as const };
}
