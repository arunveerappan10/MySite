import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">New project</h1>
      <ProjectForm />
    </div>
  );
}
