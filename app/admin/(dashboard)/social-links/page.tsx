import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllSocialLinksForAdmin } from "@/lib/queries/social-links";
import { SocialLinkList } from "./social-link-list";

export default async function SocialLinksAdminPage() {
  const socialLinks = await getAllSocialLinksForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Social links</h1>
          <p className="mt-1 text-sm text-muted-foreground">Footer / contact social links.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/social-links/new">
            <Plus className="h-4 w-4" />
            New social link
          </Link>
        </Button>
      </div>
      <SocialLinkList socialLinks={socialLinks} />
    </div>
  );
}
