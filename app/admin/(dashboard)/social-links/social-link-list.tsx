"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icon-map";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { SocialLinkRow } from "@/lib/types";
import { deleteSocialLink, reorderSocialLinks, toggleSocialLinkPublish } from "./actions";

export function SocialLinkList({ socialLinks }: { socialLinks: SocialLinkRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: socialLinks,
    reorderAction: reorderSocialLinks,
    toggleAction: toggleSocialLinkPublish,
    deleteAction: deleteSocialLink,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No social links yet.</p>;
  }

  return (
    <SortableList
      id="social-links-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.label}
      onReorder={reorder}
      renderItem={(item) => {
        const Icon = getIcon(item.icon);
        return (
          <div className="flex items-center gap-4">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.label}</p>
              <p className="truncate text-xs text-muted-foreground">{item.url}</p>
            </div>
            <PublishToggle
              id={item.id}
              checked={item.is_published}
              onCheckedChange={(checked) => togglePublish(item.id, checked)}
            />
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.label}`}>
              <Link href={`/admin/social-links/${item.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteConfirmDialog itemLabel={item.label} onConfirm={() => remove(item.id)} />
          </div>
        );
      }}
    />
  );
}
