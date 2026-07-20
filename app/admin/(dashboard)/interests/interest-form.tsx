"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconSelectField } from "@/components/admin/icon-select-field";
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
