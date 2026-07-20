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
import type { CertificationRow } from "@/lib/types";
import { certificationSchema, type CertificationInput } from "@/lib/validations/certifications";
import { createCertification, updateCertification } from "./actions";

export function CertificationForm({ certification }: { certification?: CertificationRow }) {
  const router = useRouter();
  const isEditing = !!certification;
  const [recordId] = useState(() => certification?.id ?? crypto.randomUUID());

  const form = useForm<CertificationInput>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: certification?.name ?? "",
      issuer: certification?.issuer ?? "",
      credential_id: certification?.credential_id ?? "",
      validity_label: certification?.validity_label ?? "",
      verify_url: certification?.verify_url ?? "",
      image_url: certification?.image_url ?? null,
    },
  });

  async function onSubmit(data: CertificationInput) {
    const result = isEditing
      ? await updateCertification(recordId, data, certification.image_url)
      : await createCertification(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Certification updated" : "Certification created");
    router.push("/admin/certifications");
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
                  collection="certifications"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="issuer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issuer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="credential_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="validity_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validity (free text, e.g. &ldquo;No expiry&rdquo;)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verify_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify URL (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create certification"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/certifications")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
