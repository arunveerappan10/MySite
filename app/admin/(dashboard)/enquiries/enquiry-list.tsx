"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Badge } from "@/components/ui/badge";
import type { EnquiryRow } from "@/lib/types";
import { deleteEnquiry } from "./actions";

const STATUS_VARIANT = {
  new: "default",
  read: "secondary",
  archived: "outline",
} as const;

export function EnquiryList({ enquiries }: { enquiries: EnquiryRow[] }) {
  const [items, setItems] = useState(enquiries);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No enquiries yet.</p>;
  }

  async function handleDelete(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((item) => item.id !== id));
    const result = await deleteEnquiry(id);
    if (result.error) {
      setItems(previous);
      toast.error(result.error);
    } else {
      toast.success("Deleted");
    }
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 bg-card/40 px-4 py-3">
          <Badge variant={STATUS_VARIANT[item.status]} className="shrink-0 capitalize">
            {item.status}
          </Badge>
          <Link href={`/admin/enquiries/${item.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {item.name} <span className="font-normal text-muted-foreground">— {item.email}</span>
            </p>
            <p className="truncate text-xs text-muted-foreground">{item.message}</p>
          </Link>
          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <DeleteConfirmDialog itemLabel={`enquiry from ${item.name}`} onConfirm={() => handleDelete(item.id)} />
        </li>
      ))}
    </ul>
  );
}
