"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SectionRow } from "@/lib/types";
import { sectionEditSchema, type SectionEditInput } from "@/lib/validations/sections";
import { reorderSections, updateSectionCopy } from "./actions";

export function SectionsList({ sections }: { sections: SectionRow[] }) {
  const [items, setItems] = useState(sections);
  const [editing, setEditing] = useState<SectionRow | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    const previous = items;
    setItems(reordered);

    const order = reordered.map((s, index) => ({ id: s.id, position: (index + 1) * 10 }));
    const result = await reorderSections(order);
    if (result.error) {
      toast.error(result.error);
      setItems(previous);
    } else {
      setItems(reordered.map((s, index) => ({ ...s, position: order[index].position })));
      toast.success("Order saved");
    }
  }

  function handleSaved(updated: SectionEditInput) {
    setItems((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
    );
    setEditing(null);
  }

  return (
    <>
      <DndContext
        id="sections-reorder"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {items.map((section) => (
              <SortableRow key={section.id} section={section} onEdit={() => setEditing(section)} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <EditSectionDialog
        section={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSaved={handleSaved}
      />
    </>
  );
}

function SortableRow({ section, onEdit }: { section: SectionRow; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-card/40 px-4 py-3"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Reorder ${section.key} section`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {section.key}
          </span>
          {section.nav_label && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              nav: {section.nav_label}
            </span>
          )}
        </div>
        <p className="truncate text-sm font-medium">{section.heading || "(no heading set)"}</p>
        {section.eyebrow && (
          <p className="truncate text-xs text-muted-foreground">{section.eyebrow}</p>
        )}
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="gap-1.5 shrink-0">
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </li>
  );
}

function EditSectionDialog({
  section,
  onOpenChange,
  onSaved,
}: {
  section: SectionRow | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (updated: SectionEditInput) => void;
}) {
  return (
    <Dialog open={!!section} onOpenChange={onOpenChange}>
      <DialogContent>
        {section && (
          <EditSectionForm section={section} onSaved={onSaved} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditSectionForm({
  section,
  onSaved,
  onCancel,
}: {
  section: SectionRow;
  onSaved: (updated: SectionEditInput) => void;
  onCancel: () => void;
}) {
  const form = useForm<SectionEditInput>({
    resolver: zodResolver(sectionEditSchema),
    defaultValues: {
      id: section.id,
      eyebrow: section.eyebrow,
      heading: section.heading,
      nav_label: section.nav_label,
    },
  });

  async function onSubmit(data: SectionEditInput) {
    const result = await updateSectionCopy(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Section updated");
      onSaved(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-wide">
            {section.key}
          </DialogTitle>
        </DialogHeader>
        <FormField
          control={form.control}
          name="eyebrow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eyebrow</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heading (use {"{{word}}"} to italicize/accent a word)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nav_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nav label (blank = not shown in nav)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
