import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllInterestsForAdmin } from "@/lib/queries/interests";
import { InterestList } from "./interest-list";

export default async function InterestsAdminPage() {
  const interests = await getAllInterestsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Interests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Interests tiles.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/interests/new">
            <Plus className="h-4 w-4" />
            New interest
          </Link>
        </Button>
      </div>
      <InterestList interests={interests} />
    </div>
  );
}
