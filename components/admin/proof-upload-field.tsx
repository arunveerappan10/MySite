"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { parseStorageUrl } from "@/lib/storage-utils";
import { createClient } from "@/lib/supabase/client";

/** Per-bucket ceilings, matching what the buckets themselves accept — enforcing them here
 * turns an opaque storage rejection into a readable message. */
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const PDF_TYPE = "application/pdf";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

interface ProofUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Collection folder name — path becomes {bucket}/{collection}/{recordId}/{uuid}.ext */
  collection: string;
  recordId: string;
}

/** Proof of an award or credential: either a file the admin uploads (PDF certificate, or a
 * photo/screenshot) or an external link. Both land in the same `proof_url` column, so the
 * public card only ever has one thing to render. */
export function ProofUploadField({ value, onChange, collection, recordId }: ProofUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploaded = value ? parseStorageUrl(value) : null;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isPdf = file.type === PDF_TYPE;
    if (!isPdf && !IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use PDF, PNG, JPEG, or WebP.");
      return;
    }
    const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      toast.error(`File is too large. Max ${isPdf ? "10MB" : "5MB"}.`);
      return;
    }

    // PDFs and images have their own buckets — each only whitelists its own MIME types.
    const bucket = isPdf ? STORAGE_BUCKETS.documents : STORAGE_BUCKETS.media;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "bin";
      const path = `${collection}/${recordId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {uploaded ? (
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-primary" />
          <a
            href={value!}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate underline underline-offset-2"
          >
            {uploaded.path.split("/").pop()}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="ml-auto shrink-0"
            onClick={() => onChange(null)}
            aria-label="Remove proof"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <Input
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder="Paste a link, or upload a file below"
          inputMode="url"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={[PDF_TYPE, ...IMAGE_TYPES].join(",")}
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
        {uploading ? "Uploading…" : uploaded ? "Replace file" : "Upload file"}
      </Button>
    </div>
  );
}
