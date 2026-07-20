import { notFound } from "next/navigation";
import { getCertificationByIdForAdmin } from "@/lib/queries/certifications";
import { CertificationForm } from "../../certification-form";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certification = await getCertificationByIdForAdmin(id);
  if (!certification) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit certification</h1>
      <CertificationForm certification={certification} />
    </div>
  );
}
