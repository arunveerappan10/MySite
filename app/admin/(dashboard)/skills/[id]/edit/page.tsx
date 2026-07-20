import { notFound } from "next/navigation";
import { getSkillGroupByIdForAdmin } from "@/lib/queries/skill-groups";
import { SkillGroupForm } from "../../skill-group-form";

export default async function EditSkillGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skillGroup = await getSkillGroupByIdForAdmin(id);
  if (!skillGroup) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit skill group</h1>
      <SkillGroupForm skillGroup={skillGroup} />
    </div>
  );
}
