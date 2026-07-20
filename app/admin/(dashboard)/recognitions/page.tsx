import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllRecognitionsForAdmin } from "@/lib/queries/recognitions";
import { RecognitionList } from "./recognition-list";

export default async function RecognitionsAdminPage() {
  const recognitions = await getAllRecognitionsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Recognitions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Awards cards.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/recognitions/new">
            <Plus className="h-4 w-4" />
            New recognition
          </Link>
        </Button>
      </div>
      <RecognitionList recognitions={recognitions} />
    </div>
  );
}
