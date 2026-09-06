import { z } from "zod";
import { ICON_KEYS } from "@/lib/icon-map";
import { optionalTextSchema, optionalUrlSchema } from "./common";

/** Rows listed in an interest's dialog — a volunteering event with its date, a chess
 * format with its rating. Roomier than keyValueSchema because event names run long, and
 * `value` may be blank for an entry that is just a name. */
export const interestDetailSchema = z.object({
  label: z.string().trim().min(1, "Required").max(120),
  value: z.string().trim().max(60),
});

export const interestSchema = z.object({
  label: z.string().trim().min(1, "Required").max(60),
  icon: z.enum(ICON_KEYS),
  link_url: optionalUrlSchema,
  link_label: optionalTextSchema(60),
  details: z.array(interestDetailSchema).max(12, "Up to 12 items"),
  image_url: z.string().url().nullable(),
});

export type InterestInput = z.infer<typeof interestSchema>;
