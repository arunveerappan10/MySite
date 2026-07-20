"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrderableRow {
  id: string;
  position: number;
  is_published: boolean;
}

type ActionResult = { error?: string; success?: true };

interface UseAdminCollectionArgs<T extends OrderableRow> {
  initialItems: T[];
  reorderAction: (order: { id: string; position: number }[]) => Promise<ActionResult>;
  toggleAction: (id: string, isPublished: boolean) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
}

/** Shared optimistic create/toggle/reorder/delete plumbing for the 9 admin collection lists.
 * Server Actions return `{error}` rather than throwing, so mutationFn converts that into a
 * rejection — it's the only way to get useMutation's onError (and therefore rollback) to fire. */
export function useAdminCollection<T extends OrderableRow>({
  initialItems,
  reorderAction,
  toggleAction,
  deleteAction,
}: UseAdminCollectionArgs<T>) {
  const [items, setItems] = useState(initialItems);

  const reorder = useMutation({
    mutationFn: async (order: { id: string; position: number }[]) => {
      const result = await reorderAction(order);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onMutate: (order) => {
      const previous = items;
      const positionById = new Map(order.map((o) => [o.id, o.position]));
      setItems((prev) =>
        [...prev]
          .map((item) => ({ ...item, position: positionById.get(item.id) ?? item.position }))
          .sort((a, b) => a.position - b.position),
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context) setItems(context.previous);
      toast.error(err instanceof Error ? err.message : "Failed to save order");
    },
    onSuccess: () => toast.success("Order saved"),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const result = await toggleAction(id, isPublished);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onMutate: ({ id, isPublished }) => {
      const previous = items;
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_published: isPublished } : item)));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context) setItems(context.previous);
      toast.error(err instanceof Error ? err.message : "Failed to update");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAction(id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onMutate: (id) => {
      const previous = items;
      setItems((prev) => prev.filter((item) => item.id !== id));
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context) setItems(context.previous);
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    },
    onSuccess: () => toast.success("Deleted"),
  });

  return {
    items,
    reorder: (order: { id: string; position: number }[]) => reorder.mutate(order),
    togglePublish: (id: string, isPublished: boolean) => togglePublish.mutate({ id, isPublished }),
    remove: (id: string) => remove.mutate(id),
  };
}
