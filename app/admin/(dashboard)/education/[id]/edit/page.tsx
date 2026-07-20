import { notFound } from "next/navigation";
import { getEducationEntryByIdForAdmin } from "@/lib/queries/education";
import { EducationForm } from "../../education-form";

export default async function EditEducationEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEducationEntryByIdForAdmin(id);
  if (!entry) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit education entry</h1>
      <EducationForm entry={entry} />
    </div>
  );
}
