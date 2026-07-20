"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import type { SettingsRow } from "@/lib/types";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";
import { updateSettings } from "./actions";

export function SettingsForm({ settings }: { settings: SettingsRow }) {
  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_title: settings.site_title,
      site_description: settings.site_description,
      footer_bio: settings.footer_bio,
      footer_tagline: settings.footer_tagline,
      nav_cta_label: settings.nav_cta_label,
      nav_cta_href: settings.nav_cta_href,
    },
  });

  async function onSubmit(data: SettingsInput) {
    const result = await updateSettings(data);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Settings updated");
      form.reset(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <FormField
          control={form.control}
          name="site_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="site_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site description (SEO meta description)</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="footer_bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer bio</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="footer_tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer tagline (bottom-bar signature line)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nav_cta_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nav CTA label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nav_cta_href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nav CTA link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
