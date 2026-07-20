import "server-only";
import { createHash } from "node:crypto";

/** Salts and hashes an IP before it ever touches rate_limit_hits/enquiries — raw IPs are never stored. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${process.env.IP_HASH_SALT}`).digest("hex");
}
