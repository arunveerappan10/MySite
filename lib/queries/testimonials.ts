import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/lib/types";

export const getTestimonials = cache(async (): Promise<TestimonialRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load testimonials", { error: error.message });
    throw new Error("Unable to load testimonials");
  }

  return (data ?? []) as TestimonialRow[];
});

export const getAllTestimonialsForAdmin = cache(async (): Promise<TestimonialRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load testimonials (admin)", { error: error.message });
    throw new Error("Unable to load testimonials");
  }

  return (data ?? []) as TestimonialRow[];
});

export const getTestimonialByIdForAdmin = cache(async (id: string): Promise<TestimonialRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load testimonial", { error: error.message, id });
    throw new Error("Unable to load testimonial");
  }

  return data as TestimonialRow | null;
});
