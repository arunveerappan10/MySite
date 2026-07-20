import { z } from "zod";

/** Shared shape for jsonb `{label,value}[]` columns (hero stats, project metrics, experience highlights). */
export const keyValueSchema = z.object({
  label: z.string().min(1, "Required").max(40),
  value: z.string().min(1, "Required").max(40),
});

export const optionalUrlSchema = z
  .string()
  .trim()
  .max(2000)
  .url("Enter a valid URL")
  .nullable()
  .optional()
  .or(z.literal(""));

export const positionSchema = z.number().int().min(0);
