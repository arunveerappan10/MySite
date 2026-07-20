"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { ProjectRow } from "@/lib/types";
import { deleteProject, reorderProjects, toggleProjectPublish } from "./actions";

export function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: projects,
    reorderAction: reorderProjects,
    toggleAction: toggleProjectPublish,
    deleteAction: deleteProject,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects yet.</p>;
  }

  return (
    <SortableList
      id="projects-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.title}
      onReorder={reorder}
      renderItem={(item) => (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.title}</p>
            <p className="truncate text-xs text-muted-foreground">{item.tag}</p>
          </div>
          <PublishToggle
            id={item.id}
            checked={item.is_published}
            onCheckedChange={(checked) => togglePublish(item.id, checked)}
          />
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.title}`}>
            <Link href={`/admin/projects/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmDialog itemLabel={item.title} onConfirm={() => remove(item.id)} />
        </div>
      )}
    />
  );
}
