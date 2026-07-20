"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Collection folder name, e.g. "projects" — path becomes media/{collection}/{recordId}/{uuid}.ext */
  collection: string;
  recordId: string;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  collection,
  recordId,
  label = "Image",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use PNG, JPEG, WebP, GIF, or SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is too large. Max 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "bin";
      const path = `${collection}/${recordId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.media)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(STORAGE_BUCKETS.media).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-md border border-border">
          <Image src={value} alt="" fill sizes="128px" className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute top-1 right-1"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
          <ImagePlus className="h-6 w-6" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
      </Button>
    </div>
  );
}
