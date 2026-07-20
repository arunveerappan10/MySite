import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllEducationEntriesForAdmin } from "@/lib/queries/education";
import { EducationList } from "./education-list";

export default async function EducationAdminPage() {
  const entries = await getAllEducationEntriesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Education</h1>
          <p className="mt-1 text-sm text-muted-foreground">Education timeline.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/education/new">
            <Plus className="h-4 w-4" />
            New entry
          </Link>
        </Button>
      </div>
      <EducationList entries={entries} />
    </div>
  );
}
