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
import { Textarea } from "@/components/ui/textarea";
import type { TestimonialRow } from "@/lib/types";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonials";
import { createTestimonial, updateTestimonial } from "./actions";

export function TestimonialForm({ testimonial }: { testimonial?: TestimonialRow }) {
  const router = useRouter();
  const isEditing = !!testimonial;
  const [recordId] = useState(() => testimonial?.id ?? crypto.randomUUID());

  const form = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author_name: testimonial?.author_name ?? "",
      author_role: testimonial?.author_role ?? null,
      quote: testimonial?.quote ?? "",
      image_url: testimonial?.image_url ?? null,
      rating: testimonial?.rating ?? null,
    },
  });

  async function onSubmit(data: TestimonialInput) {
    const result = isEditing
      ? await updateTestimonial(recordId, data, testimonial.image_url)
      : await createTestimonial(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Testimonial updated" : "Testimonial created");
    router.push("/admin/testimonials");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo (falls back to initials if omitted)</FormLabel>
              <FormControl>
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  collection="testimonials"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author role (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1–5, optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create testimonial"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/testimonials")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
