"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 10 * 1024 * 1024;

interface FileUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function FileUploadField({ value, onChange, label = "File" }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Unsupported file type. Use PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is too large. Max 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `resume-${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.documents)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(STORAGE_BUCKETS.documents).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate underline underline-offset-2"
          >
            {value.split("/").pop()}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="ml-auto shrink-0"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
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
