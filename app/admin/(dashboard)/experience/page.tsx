import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllExperienceEntriesForAdmin } from "@/lib/queries/experience";
import { ExperienceList } from "./experience-list";

export default async function ExperienceAdminPage() {
  const entries = await getAllExperienceEntriesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Experience</h1>
          <p className="mt-1 text-sm text-muted-foreground">Work history entries.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/experience/new">
            <Plus className="h-4 w-4" />
            New entry
          </Link>
        </Button>
      </div>
      <ExperienceList entries={entries} />
    </div>
  );
}
