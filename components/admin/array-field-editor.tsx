"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KeyValueArrayEditorProps {
  name: string;
  maxItems?: number;
}

/** Generic add/remove editor for jsonb `{label,value}[]` columns — hero stats, project
 * metrics, experience highlights. Must render inside a react-hook-form <Form> (FormProvider). */
export function KeyValueArrayEditor({ name, maxItems }: KeyValueArrayEditorProps) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input {...register(`${name}.${index}.label`)} placeholder="Label" className="flex-1" />
          <Input {...register(`${name}.${index}.value`)} placeholder="Value" className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(index)}
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {(!maxItems || fields.length < maxItems) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ label: "", value: "" })}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      )}
    </div>
  );
}

interface StringArrayEditorProps {
  name: string;
  placeholder?: string;
}

/** Same idea for jsonb `string[]` columns — experience impact bullets, tech stack, skill items. */
export function StringArrayEditor({ name, placeholder }: StringArrayEditorProps) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input {...register(`${name}.${index}`)} placeholder={placeholder} className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(index)}
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
        className="gap-2"
      >
        <Plus className="h-4 w-4" /> Add
      </Button>
    </div>
  );
}
