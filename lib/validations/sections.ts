import { z } from "zod";

export const sectionEditSchema = z.object({
  id: z.string().uuid(),
  eyebrow: z.string().trim().max(80),
  heading: z.string().trim().min(1, "Required").max(200),
  nav_label: z.string().trim().max(40).nullable(),
});

export const sectionsReorderSchema = z.array(
  z.object({ id: z.string().uuid(), position: z.number().int().min(0) }),
);

export type SectionEditInput = z.infer<typeof sectionEditSchema>;
