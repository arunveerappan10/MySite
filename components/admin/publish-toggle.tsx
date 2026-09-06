"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PublishToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** State wording. Collections read Published/Draft; a page section reads Shown/Hidden,
   * where "draft" would misdescribe a section that simply is not on the page. */
  labels?: { on: string; off: string };
}

export function PublishToggle({
  id,
  checked,
  onCheckedChange,
  labels = { on: "Published", off: "Draft" },
}: PublishToggleProps) {
  const inputId = `publish-${id}`;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Switch id={inputId} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={inputId} className="cursor-pointer text-xs text-muted-foreground">
        {checked ? labels.on : labels.off}
      </Label>
    </div>
  );
}
