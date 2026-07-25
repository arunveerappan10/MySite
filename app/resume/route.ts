import { getProfile } from "@/lib/queries/profile";
import { getSettings } from "@/lib/queries/settings";

/** Same-origin proxy for the resume download — keeps the Supabase Storage URL out of the
 * link visitors see/hover, and guarantees a real download with a clean filename (the
 * `download` attribute isn't reliable cross-origin). */
export async function GET() {
  const settings = await getSettings();
  if (!settings.resume_file_url) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(settings.resume_file_url);
  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  const profile = await getProfile();
  const filename = `${profile.full_name.trim().replace(/\s+/g, "-")}-Resume.pdf`;

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
