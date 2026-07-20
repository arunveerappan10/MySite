import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Authoritative admin check for Server Components/Actions under /admin. middleware.ts
 * only confirms a session exists (cheap, no admin_users lookup); this confirms the user
 * is actually in admin_users — the same check RLS itself keys off via public.is_admin().
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/admin/login");
  }

  return { user };
}
