"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { CertificationRow } from "@/lib/types";
import { deleteCertification, reorderCertifications, toggleCertificationPublish } from "./actions";

export function CertificationList({ certifications }: { certifications: CertificationRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: certifications,
    reorderAction: reorderCertifications,
    toggleAction: toggleCertificationPublish,
    deleteAction: deleteCertification,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No certifications yet.</p>;
  }

  return (
    <SortableList
      id="certifications-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.name}
      onReorder={reorder}
      renderItem={(item) => (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="truncate text-xs text-muted-foreground">{item.issuer}</p>
          </div>
          <PublishToggle
            id={item.id}
            checked={item.is_published}
            onCheckedChange={(checked) => togglePublish(item.id, checked)}
          />
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.name}`}>
            <Link href={`/admin/certifications/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmDialog itemLabel={item.name} onConfirm={() => remove(item.id)} />
        </div>
      )}
    />
  );
}
