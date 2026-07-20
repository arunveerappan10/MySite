import { z } from "zod";
import { optionalUrlSchema } from "./common";

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Required").max(160),
  issuer: z.string().trim().min(1, "Required").max(120),
  credential_id: z.string().trim().min(1, "Required").max(120),
  validity_label: z.string().trim().min(1, "Required").max(60),
  verify_url: optionalUrlSchema,
  image_url: z.string().url().nullable(),
});

export type CertificationInput = z.infer<typeof certificationSchema>;
