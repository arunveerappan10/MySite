"use client";

import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { SortableList } from "@/components/admin/sortable-list";
import { Button } from "@/components/ui/button";
import { useAdminCollection } from "@/lib/hooks/use-admin-collection";
import type { TestimonialRow } from "@/lib/types";
import { deleteTestimonial, reorderTestimonials, toggleTestimonialPublish } from "./actions";

export function TestimonialList({ testimonials }: { testimonials: TestimonialRow[] }) {
  const { items, reorder, togglePublish, remove } = useAdminCollection({
    initialItems: testimonials,
    reorderAction: reorderTestimonials,
    toggleAction: toggleTestimonialPublish,
    deleteAction: deleteTestimonial,
  });

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No testimonials yet.</p>;
  }

  return (
    <SortableList
      id="testimonials-reorder"
      items={items}
      getId={(item) => item.id}
      itemLabel={(item) => item.author_name}
      onReorder={reorder}
      renderItem={(item) => (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{item.author_name}</p>
              {item.rating && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  {item.rating}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">{item.author_role ?? item.quote}</p>
          </div>
          <PublishToggle
            id={item.id}
            checked={item.is_published}
            onCheckedChange={(checked) => togglePublish(item.id, checked)}
          />
          <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${item.author_name}`}>
            <Link href={`/admin/testimonials/${item.id}/edit`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmDialog itemLabel={item.author_name} onConfirm={() => remove(item.id)} />
        </div>
      )}
    />
  );
}
