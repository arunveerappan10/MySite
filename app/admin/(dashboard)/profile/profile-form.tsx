"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyValueArrayEditor } from "@/components/admin/array-field-editor";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileRow } from "@/lib/types";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "./actions";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name,
      hero_accent_word: profile.hero_accent_word,
      hero_eyebrow: profile.hero_eyebrow,
      hero_subheading: profile.hero_subheading,
      hero_stats: profile.hero_stats,
      about_summary: profile.about_summary,
      email: profile.email,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      availability_note: profile.availability_note ?? "",
      contact_intro: profile.contact_intro,
      image_url: profile.image_url,
    },
  });

  async function onSubmit(data: ProfileInput) {
    const result = await updateProfile(data, profile.image_url);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated");
      form.reset(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-display text-xl">Hero</h2>
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    collection="profile"
                    recordId="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hero_accent_word"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent word (italicized in the H1 — must appear in full name)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hero_eyebrow"
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
            name="hero_subheading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subheading</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Hero stats (up to 6)</FormLabel>
            <div className="mt-2">
              <KeyValueArrayEditor name="hero_stats" maxItems={6} />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="font-display text-xl">About</h2>
          <FormField
            control={form.control}
            name="about_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Separator />

        <section className="space-y-4">
          <h2 className="font-display text-xl">Contact</h2>
          <FormField
            control={form.control}
            name="contact_intro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact intro</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability_note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability note</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
