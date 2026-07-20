import { notFound } from "next/navigation";
import { getRecognitionByIdForAdmin } from "@/lib/queries/recognitions";
import { RecognitionForm } from "../../recognition-form";

export default async function EditRecognitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recognition = await getRecognitionByIdForAdmin(id);
  if (!recognition) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit recognition</h1>
      <RecognitionForm recognition={recognition} />
    </div>
  );
}
