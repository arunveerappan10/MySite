import { notFound } from "next/navigation";
import { getProjectByIdForAdmin } from "@/lib/queries/projects";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectByIdForAdmin(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
