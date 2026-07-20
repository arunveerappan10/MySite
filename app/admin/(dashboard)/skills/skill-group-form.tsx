"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StringArrayEditor } from "@/components/admin/array-field-editor";
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
import type { SkillGroupRow } from "@/lib/types";
import { skillGroupSchema, type SkillGroupInput } from "@/lib/validations/skill-groups";
import { createSkillGroup, updateSkillGroup } from "./actions";

export function SkillGroupForm({ skillGroup }: { skillGroup?: SkillGroupRow }) {
  const router = useRouter();
  const isEditing = !!skillGroup;
  const [recordId] = useState(() => skillGroup?.id ?? crypto.randomUUID());

  const form = useForm<SkillGroupInput>({
    resolver: zodResolver(skillGroupSchema),
    defaultValues: {
      group_name: skillGroup?.group_name ?? "",
      icon: (skillGroup?.icon as SkillGroupInput["icon"]) ?? DEFAULT_ICON,
      items: skillGroup?.items ?? [],
      image_url: skillGroup?.image_url ?? null,
    },
  });

  async function onSubmit(data: SkillGroupInput) {
    const result = isEditing
      ? await updateSkillGroup(recordId, data, skillGroup.image_url)
      : await createSkillGroup(recordId, data);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(isEditing ? "Skill group updated" : "Skill group created");
    router.push("/admin/skills");
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
                  collection="skill-groups"
                  recordId={recordId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name</FormLabel>
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
        <div>
          <FormLabel>Items</FormLabel>
          <div className="mt-2">
            <StringArrayEditor name="items" placeholder="Skill" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create skill group"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/skills")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
