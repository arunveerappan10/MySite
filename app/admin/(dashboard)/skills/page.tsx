import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllSkillGroupsForAdmin } from "@/lib/queries/skill-groups";
import { SkillGroupList } from "./skill-group-list";

export default async function SkillsAdminPage() {
  const skillGroups = await getAllSkillGroupsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">Skill groups grid.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/skills/new">
            <Plus className="h-4 w-4" />
            New skill group
          </Link>
        </Button>
      </div>
      <SkillGroupList skillGroups={skillGroups} />
    </div>
  );
}
