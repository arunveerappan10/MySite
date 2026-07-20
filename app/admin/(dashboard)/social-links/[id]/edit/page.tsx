import { notFound } from "next/navigation";
import { getSocialLinkByIdForAdmin } from "@/lib/queries/social-links";
import { SocialLinkForm } from "../../social-link-form";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const socialLink = await getSocialLinkByIdForAdmin(id);
  if (!socialLink) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit social link</h1>
      <SocialLinkForm socialLink={socialLink} />
    </div>
  );
}
