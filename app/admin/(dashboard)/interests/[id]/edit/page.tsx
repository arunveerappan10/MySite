import { notFound } from "next/navigation";
import { getInterestByIdForAdmin } from "@/lib/queries/interests";
import { InterestForm } from "../../interest-form";

export default async function EditInterestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const interest = await getInterestByIdForAdmin(id);
  if (!interest) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit interest</h1>
      <InterestForm interest={interest} />
    </div>
  );
}
