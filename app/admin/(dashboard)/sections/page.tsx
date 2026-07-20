import { getAllSectionsForAdmin } from "@/lib/queries/sections";
import { SectionsList } from "./sections-list";

export default async function SectionsAdminPage() {
  const sections = await getAllSectionsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Sections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag to reorder page sections, edit to change eyebrow/heading copy and nav label.
          This is a fixed set of 10 — sections can&apos;t be added or removed here.
        </p>
      </div>
      <SectionsList sections={sections} />
    </div>
  );
}
