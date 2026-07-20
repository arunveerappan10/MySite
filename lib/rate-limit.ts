import "server-only";
import { RATE_LIMIT } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Sliding-window rate limit (3 requests / 10 minutes per salted IP hash) backed by
 * rate_limit_hits. Service-role only — this table has no anon/authenticated RLS policies
 * since rate limiting inherently requires reading other visitors' metadata by IP.
 */
export async function checkRateLimit(ipHash: string): Promise<{ allowed: boolean }> {
  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000).toISOString();

  // Opportunistic prune: rows older than the window can never count toward any check again.
  await supabase.from("rate_limit_hits").delete().eq("route", RATE_LIMIT.route).lt("created_at", windowStart);

  const { count, error } = await supabase
    .from("rate_limit_hits")
    .select("id", { count: "exact", head: true })
    .eq("route", RATE_LIMIT.route)
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (error) {
    logger.error("Rate limit check failed", { error: error.message });
    // Fail open: Turnstile + Zod validation still guard the insert itself, so a transient
    // DB error here shouldn't block a legitimate visitor from submitting the form.
    return { allowed: true };
  }

  if ((count ?? 0) >= RATE_LIMIT.maxRequests) {
    return { allowed: false };
  }

  const { error: insertError } = await supabase
    .from("rate_limit_hits")
    .insert({ ip_hash: ipHash, route: RATE_LIMIT.route });

  if (insertError) {
    logger.error("Failed to record rate limit hit", { error: insertError.message });
  }

  return { allowed: true };
}
