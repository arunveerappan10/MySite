import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProjectsForAdmin } from "@/lib/queries/projects";
import { ProjectList } from "./project-list";

export default async function ProjectsAdminPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Work / Impact accordion entries.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
