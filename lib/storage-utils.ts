/** Extracts the storage object path from a Supabase public URL, e.g.
 * ".../storage/v1/object/public/media/projects/abc/xyz.webp" -> "projects/abc/xyz.webp".
 * Used to clean up the old file when an image is replaced or its owning row is deleted. */
export function extractStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
