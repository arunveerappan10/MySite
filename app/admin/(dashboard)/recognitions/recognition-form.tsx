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
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_ICON } from "@/lib/icon-map";
import type { RecognitionRow } from "@/lib/types";
import { recognitionSchema, type RecognitionInput } from "@/lib/validations/recognitions";
import { createRecognition, updateRecognition } from "./actions";

export function RecognitionForm({ recognition }: { recognition?: RecognitionRow }) {
  const router = useRouter();
  const isEditing = !!recognition;
  const [recordId] = useState(() => recognition?.id ?? crypto.randomUUID());

  const form = useForm<RecognitionInput>({
    resolver: zodResolver(recognitionSchema),
    defaultValues: {
      icon: (recognition?.icon as RecognitionInput["icon"]) ?? DEFAULT_ICON,
      title: recognition?.title ?? "",
      body: recognition?.body ?? "",
      image_url: recognition?.image_url ?? null,
    },
  });

  async function onSubmit(data: RecognitionInput) {
    const result = isEditing
      ? await updateRecognition(recordId, data, recognition.image_url)
      : await createRecognition(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Recognition updated" : "Recognition created");
    router.push("/admin/recognitions");
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
                  collection="recognitions"
                  recordId={recordId}
                />
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create recognition"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/recognitions")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
