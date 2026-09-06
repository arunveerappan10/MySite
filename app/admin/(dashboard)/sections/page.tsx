import { getAllSectionsForAdmin, getSectionItemCounts } from "@/lib/queries/sections";
import { SectionsList } from "./sections-list";

export default async function SectionsAdminPage() {
  const [sections, itemCounts] = await Promise.all([
    getAllSectionsForAdmin(),
    getSectionItemCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Sections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag to reorder page sections, edit to change eyebrow/heading copy and nav label,
          and switch one off to take it off the page. This is a fixed set of 10 — new
          sections need code, so they can&apos;t be created here. A section shown but empty
          still renders nothing; its content lives in that collection&apos;s own admin page.
        </p>
      </div>
      <SectionsList sections={sections} itemCounts={itemCounts} />
    </div>
  );
}
