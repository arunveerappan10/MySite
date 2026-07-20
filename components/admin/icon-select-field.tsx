"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getIcon, ICON_KEYS } from "@/lib/icon-map";

interface IconSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Shared icon picker for skill_groups, recognitions, and interests — all validated
 * against the same curated lib/icon-map.ts enum. */
export function IconSelectField({ value, onChange }: IconSelectFieldProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose an icon" />
      </SelectTrigger>
      <SelectContent>
        {ICON_KEYS.map((key) => {
          const Icon = getIcon(key);
          return (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {key}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
