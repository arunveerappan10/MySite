import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { RecognitionRow } from "@/lib/types";

export const getRecognitions = cache(async (): Promise<RecognitionRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recognitions")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load recognitions", { error: error.message });
    throw new Error("Unable to load recognition");
  }

  return (data ?? []) as RecognitionRow[];
});

export const getAllRecognitionsForAdmin = cache(async (): Promise<RecognitionRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recognitions").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load recognitions (admin)", { error: error.message });
    throw new Error("Unable to load recognition");
  }

  return (data ?? []) as RecognitionRow[];
});

export const getRecognitionByIdForAdmin = cache(async (id: string): Promise<RecognitionRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recognitions").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load recognition", { error: error.message, id });
    throw new Error("Unable to load recognition");
  }

  return data as RecognitionRow | null;
});
