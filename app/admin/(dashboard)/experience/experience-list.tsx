"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { ExperienceEntryRow } from "@/lib/types";
import {
  deleteExperienceEntry,
  reorderExperienceEntries,
  toggleExperienceEntryPublish,
} from "./actions";

export function ExperienceList({ entries }: { entries: ExperienceEntryRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: entries,
    reorderAction: reorderExperienceEntries,
    toggleAction: toggleExperienceEntryPublish,
    deleteAction: deleteExperienceEntry,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No experience entries yet.</p>;
  }

  return (
    <SortableList
      id="experience-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => `${item.role_title} at ${item.company}`}
      onReorder={reorder}
      renderItem={(item) => (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.role_title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.company} · {item.period_label}
            </p>
          </div>
          <PublishToggle
            id={item.id}
            checked={item.is_published}
            onCheckedChange={(checked) => togglePublish(item.id, checked)}
          />
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.role_title} at ${item.company}`}>
            <Link href={`/admin/experience/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmDialog itemLabel={`${item.role_title} at ${item.company}`} onConfirm={() => remove(item.id)} />
        </div>
      )}
    />
  );
}
