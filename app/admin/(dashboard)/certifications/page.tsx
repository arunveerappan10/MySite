import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCertificationsForAdmin } from "@/lib/queries/certifications";
import { CertificationList } from "./certification-list";

export default async function CertificationsAdminPage() {
  const certifications = await getAllCertificationsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Certifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Certifications grid.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/certifications/new">
            <Plus className="h-4 w-4" />
            New certification
          </Link>
        </Button>
      </div>
      <CertificationList certifications={certifications} />
    </div>
  );
}
