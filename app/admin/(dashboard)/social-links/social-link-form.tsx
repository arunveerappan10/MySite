"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconSelectField } from "@/components/admin/icon-select-field";
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
import type { SocialLinkRow } from "@/lib/types";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations/social-links";
import { createSocialLink, updateSocialLink } from "./actions";

export function SocialLinkForm({ socialLink }: { socialLink?: SocialLinkRow }) {
  const router = useRouter();
  const isEditing = !!socialLink;
  const [recordId] = useState(() => socialLink?.id ?? crypto.randomUUID());

  const form = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: socialLink?.platform ?? "",
      label: socialLink?.label ?? "",
      url: socialLink?.url ?? "",
      icon: (socialLink?.icon as SocialLinkInput["icon"]) ?? DEFAULT_ICON,
    },
  });

  async function onSubmit(data: SocialLinkInput) {
    const result = isEditing
      ? await updateSocialLink(recordId, data)
      : await createSocialLink(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Social link updated" : "Social link created");
    router.push("/admin/social-links");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform (e.g. &ldquo;linkedin&rdquo;, &ldquo;github&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Label (display text)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
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
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create social link"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/social-links")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
