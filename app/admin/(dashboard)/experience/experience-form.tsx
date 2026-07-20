"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyValueArrayEditor, StringArrayEditor } from "@/components/admin/array-field-editor";
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
import type { ExperienceEntryRow } from "@/lib/types";
import { experienceEntrySchema, type ExperienceEntryInput } from "@/lib/validations/experience";
import { createExperienceEntry, updateExperienceEntry } from "./actions";

export function ExperienceForm({ entry }: { entry?: ExperienceEntryRow }) {
  const router = useRouter();
  const isEditing = !!entry;
  const [recordId] = useState(() => entry?.id ?? crypto.randomUUID());

  const form = useForm<ExperienceEntryInput>({
    resolver: zodResolver(experienceEntrySchema),
    defaultValues: {
      company: entry?.company ?? "",
      domain: entry?.domain ?? "",
      role_title: entry?.role_title ?? "",
      period_label: entry?.period_label ?? "",
      duration_label: entry?.duration_label ?? "",
      impact_bullets: entry?.impact_bullets ?? [],
      highlights: entry?.highlights ?? [],
      tech_stack: entry?.tech_stack ?? [],
      image_url: entry?.image_url ?? null,
    },
  });

  async function onSubmit(data: ExperienceEntryInput) {
    const result = isEditing
      ? await updateExperienceEntry(recordId, data, entry.image_url)
      : await createExperienceEntry(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Experience entry updated" : "Experience entry created");
    router.push("/admin/experience");
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
                  collection="experience"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role title</FormLabel>
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
              <FormLabel>Period (free text, e.g. &ldquo;2022 — Present&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (free text, e.g. &ldquo;2 yrs 3 mos&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Impact bullets</FormLabel>
          <div className="mt-2">
            <StringArrayEditor name="impact_bullets" placeholder="Impact bullet" />
          </div>
        </div>
        <div>
          <FormLabel>Highlights (up to 6)</FormLabel>
          <div className="mt-2">
            <KeyValueArrayEditor name="highlights" maxItems={6} />
          </div>
        </div>
        <div>
          <FormLabel>Tech stack</FormLabel>
          <div className="mt-2">
            <StringArrayEditor name="tech_stack" placeholder="Technology" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create entry"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/experience")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
