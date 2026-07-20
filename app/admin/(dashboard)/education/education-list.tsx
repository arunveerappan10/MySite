"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { EducationEntryRow } from "@/lib/types";
import { deleteEducationEntry, reorderEducationEntries, toggleEducationEntryPublish } from "./actions";

export function EducationList({ entries }: { entries: EducationEntryRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: entries,
    reorderAction: reorderEducationEntries,
    toggleAction: toggleEducationEntryPublish,
    deleteAction: deleteEducationEntry,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No education entries yet.</p>;
  }

  return (
    <SortableList
      id="education-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.school}
      onReorder={reorder}
      renderItem={(item) => (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.school}</p>
            <p className="truncate text-xs text-muted-foreground">
              {item.degree} · {item.period_label}
            </p>
          </div>
          <PublishToggle
            id={item.id}
            checked={item.is_published}
            onCheckedChange={(checked) => togglePublish(item.id, checked)}
          />
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.school}`}>
            <Link href={`/admin/education/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmDialog itemLabel={item.school} onConfirm={() => remove(item.id)} />
        </div>
      )}
    />
  );
}
