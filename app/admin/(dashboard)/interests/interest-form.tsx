"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconSelectField } from "@/components/admin/icon-select-field";
import { KeyValueArrayEditor } from "@/components/admin/array-field-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_ICON } from "@/lib/icon-map";
import type { InterestRow } from "@/lib/types";
import { interestSchema, type InterestInput } from "@/lib/validations/interests";
import { createInterest, updateInterest } from "./actions";

export function InterestForm({ interest }: { interest?: InterestRow }) {
  const router = useRouter();
  const isEditing = !!interest;
  const [recordId] = useState(() => interest?.id ?? crypto.randomUUID());

  const form = useForm<InterestInput>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      label: interest?.label ?? "",
      icon: (interest?.icon as InterestInput["icon"]) ?? DEFAULT_ICON,
      link_url: interest?.link_url ?? null,
      link_label: interest?.link_label ?? null,
      details: interest?.details ?? [],
      image_url: interest?.image_url ?? null,
    },
  });

  async function onSubmit(data: InterestInput) {
    const result = isEditing
      ? await updateInterest(recordId, data, interest.image_url)
      : await createInterest(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Interest updated" : "Interest created");
    router.push("/admin/interests");
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
                  collection="interests"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconSelectField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                  placeholder="example.com/your-profile"
                  inputMode="url"
                />
              </FormControl>
              <FormDescription>
                Shown as a button inside this interest&rsquo;s dialog &mdash; a profile, a page, an
                album. https:// is added for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link text (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || null)}
                  placeholder="Visit profile"
                />
              </FormControl>
              <FormDescription>Defaults to &ldquo;Open link&rdquo;. Needs a link above.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Details (optional)</FormLabel>
          <p className="mt-1 text-sm text-muted-foreground">
            Rows listed inside this interest&rsquo;s dialog. Left column is the name, right is an
            optional date or note. Leave empty to skip the list entirely.
          </p>
          <div className="mt-2">
            <KeyValueArrayEditor name="details" maxItems={12} />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create interest"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/interests")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
