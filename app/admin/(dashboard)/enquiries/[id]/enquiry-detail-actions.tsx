"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { deleteEnquiry, markEnquiryStatus } from "../actions";

export function EnquiryDetailActions({ id, status }: { id: string; status: "new" | "read" | "archived" }) {
  const router = useRouter();

  async function handleArchiveToggle() {
    const result = await markEnquiryStatus(id, status === "archived" ? "read" : "archived");
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(status === "archived" ? "Restored" : "Archived");
    router.refresh();
  }

  async function handleDelete() {
    const result = await deleteEnquiry(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Deleted");
    router.push("/admin/enquiries");
  }

  return (
    <div className="flex gap-3">
      <Button type="button" variant="outline" onClick={handleArchiveToggle}>
        {status === "archived" ? "Restore" : "Archive"}
      </Button>
      <DeleteConfirmDialog itemLabel="this enquiry" onConfirm={handleDelete} />
    </div>
  );
}
