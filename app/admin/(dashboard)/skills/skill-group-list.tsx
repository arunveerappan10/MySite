"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { SkillGroupRow } from "@/lib/types";
import { deleteSkillGroup, reorderSkillGroups, toggleSkillGroupPublish } from "./actions";

export function SkillGroupList({ skillGroups }: { skillGroups: SkillGroupRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: skillGroups,
    reorderAction: reorderSkillGroups,
    toggleAction: toggleSkillGroupPublish,
    deleteAction: deleteSkillGroup,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No skill groups yet.</p>;
  }

  return (
    <SortableList
      id="skill-groups-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.group_name}
      onReorder={reorder}
      renderItem={(item) => {
        const Icon = getIcon(item.icon);
        return (
          <div className="flex items-center gap-4">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.group_name}</p>
              <p className="truncate text-xs text-muted-foreground">{item.items.join(", ")}</p>
            </div>
            <PublishToggle
              id={item.id}
              checked={item.is_published}
              onCheckedChange={(checked) => togglePublish(item.id, checked)}
            />
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.group_name}`}>
              <Link href={`/admin/skills/${item.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteConfirmDialog itemLabel={item.group_name} onConfirm={() => remove(item.id)} />
          </div>
        );
      }}
    />
  );
}
