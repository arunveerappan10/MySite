"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { RecognitionRow } from "@/lib/types";
import { deleteRecognition, reorderRecognitions, toggleRecognitionPublish } from "./actions";

export function RecognitionList({ recognitions }: { recognitions: RecognitionRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: recognitions,
    reorderAction: reorderRecognitions,
    toggleAction: toggleRecognitionPublish,
    deleteAction: deleteRecognition,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No recognitions yet.</p>;
  }

  return (
    <SortableList
      id="recognitions-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.title}
      onReorder={reorder}
      renderItem={(item) => {
        const Icon = getIcon(item.icon);
        return (
          <div className="flex items-center gap-4">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.body}</p>
            </div>
            <PublishToggle
              id={item.id}
              checked={item.is_published}
              onCheckedChange={(checked) => togglePublish(item.id, checked)}
            />
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.title}`}>
              <Link href={`/admin/recognitions/${item.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteConfirmDialog itemLabel={item.title} onConfirm={() => remove(item.id)} />
          </div>
        );
      }}
    />
  );
}
