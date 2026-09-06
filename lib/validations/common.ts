import { z } from "zod";

/** Shared shape for jsonb `{label,value}[]` columns (hero stats, project metrics, experience highlights). */
export const keyValueSchema = z.object({
  label: z.string().min(1, "Required").max(40),
  value: z.string().min(1, "Required").max(40),
});

const MAX_URL_LENGTH = 2000;
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Credential/verification links are rendered straight into an `href`, so only http(s) is allowed through. */
function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Optional link field.
 *
 * Blank input normalises to `null` rather than `""` so the column matches the
 * `string | null` row type, and so an update actually clears a link the admin
 * removed. A scheme-less paste ("credly.com/badges/x", the shape you get from
 * most credential sites) is prefixed with https:// instead of being rejected.
 */
export const optionalUrlSchema = z
  .union([z.string(), z.null()])
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return null;
    return HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;
  })
  .refine((value) => value === null || value.length <= MAX_URL_LENGTH, "URL is too long")
  .refine((value) => value === null || isHttpUrl(value), "Enter a valid URL");

/** Optional free text that stores NULL rather than "" when blank, so "no value" has a
 * single representation — the same rule optionalUrlSchema applies to links. */
export function optionalTextSchema(max: number) {
  return z
    .union([z.string(), z.null()])
    .transform((value) => value?.trim() || null)
    .refine((value) => value === null || value.length <= max, `Keep this under ${max} characters`);
}

export const positionSchema = z.number().int().min(0);
