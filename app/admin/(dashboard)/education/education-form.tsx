"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { EducationEntryRow } from "@/lib/types";
import { educationEntrySchema, type EducationEntryInput } from "@/lib/validations/education";
import { createEducationEntry, updateEducationEntry } from "./actions";

export function EducationForm({ entry }: { entry?: EducationEntryRow }) {
  const router = useRouter();
  const isEditing = !!entry;
  const [recordId] = useState(() => entry?.id ?? crypto.randomUUID());

  const form = useForm<EducationEntryInput>({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: {
      school: entry?.school ?? "",
      degree: entry?.degree ?? "",
      period_label: entry?.period_label ?? "",
      score_label: entry?.score_label ?? "",
      image_url: entry?.image_url ?? null,
    },
  });

  async function onSubmit(data: EducationEntryInput) {
    const result = isEditing
      ? await updateEducationEntry(recordId, data, entry.image_url)
      : await createEducationEntry(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Education entry updated" : "Education entry created");
    router.push("/admin/education");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  collection="education"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period (free text, e.g. &ldquo;2016 — 2020&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="score_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score (free text, e.g. &ldquo;8.9 CGPA&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create entry"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/education")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
