import { notFound } from "next/navigation";
import { getExperienceEntryByIdForAdmin } from "@/lib/queries/experience";
import { ExperienceForm } from "../../experience-form";

export default async function EditExperienceEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getExperienceEntryByIdForAdmin(id);
  if (!entry) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit experience entry</h1>
      <ExperienceForm entry={entry} />
    </div>
  );
}
