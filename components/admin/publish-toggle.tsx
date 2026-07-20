"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PublishToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function PublishToggle({ id, checked, onCheckedChange }: PublishToggleProps) {
  const inputId = `publish-${id}`;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Switch id={inputId} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={inputId} className="cursor-pointer text-xs text-muted-foreground">
        {checked ? "Published" : "Draft"}
      </Label>
    </div>
  );
}
