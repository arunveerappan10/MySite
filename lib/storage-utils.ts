/** Extracts the storage object path from a Supabase public URL, e.g.
 * ".../storage/v1/object/public/media/projects/abc/xyz.webp" -> "projects/abc/xyz.webp".
 * Used to clean up the old file when an image is replaced or its owning row is deleted. */
export function extractStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

/** Splits a Supabase public URL into its bucket and object path, e.g.
 * ".../storage/v1/object/public/documents/recognitions/abc/xyz.pdf"
 * -> { bucket: "documents", path: "recognitions/abc/xyz.pdf" }.
 * Returns null for anything that isn't one of our storage URLs — proof fields accept
 * external links too, and those have no object to clean up. */
export function parseStorageUrl(publicUrl: string): { bucket: string; path: string } | null {
  const marker = "/storage/v1/object/public/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  const rest = publicUrl.slice(idx + marker.length);
  const slash = rest.indexOf("/");
  if (slash === -1) return null;
  return { bucket: rest.slice(0, slash), path: rest.slice(slash + 1) };
}
