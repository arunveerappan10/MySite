import { cache } from "react";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/types";

export const getProjects = cache(async (): Promise<ProjectRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load projects", { error: error.message });
    throw new Error("Unable to load projects");
  }

  return (data ?? []) as ProjectRow[];
});

export const getAllProjectsForAdmin = cache(async (): Promise<ProjectRow[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").order("position", { ascending: true });

  if (error) {
    logger.error("Failed to load projects (admin)", { error: error.message });
    throw new Error("Unable to load projects");
  }

  return (data ?? []) as ProjectRow[];
});

export const getProjectByIdForAdmin = cache(async (id: string): Promise<ProjectRow | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error) {
    logger.error("Failed to load project", { error: error.message, id });
    throw new Error("Unable to load project");
  }

  return data as ProjectRow | null;
});
