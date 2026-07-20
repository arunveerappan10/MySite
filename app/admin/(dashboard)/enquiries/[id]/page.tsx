import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/lib/logger";
import { getEnquiryByIdForAdmin } from "@/lib/queries/enquiries";
import { createClient } from "@/lib/supabase/server";
import { EnquiryDetailActions } from "./enquiry-detail-actions";

const STATUS_VARIANT = {
  new: "default",
  read: "secondary",
  archived: "outline",
} as const;

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enquiry = await getEnquiryByIdForAdmin(id);

  if (!enquiry) {
    notFound();
  }

  if (enquiry.status === "new") {
    // Plain inline update, not the shared markEnquiryStatus action — that action calls
    // revalidatePath, which Next.js disallows during a Server Component's render. No
    // revalidation is needed here anyway: this page's own data is already fresh, and the
    // list page re-fetches on its own next navigation since it's dynamically rendered.
    const supabase = await createClient();
    const { error } = await supabase.from("enquiries").update({ status: "read" }).eq("id", id);
    if (error) {
      logger.error("Failed to auto-mark enquiry as read", { error: error.message, id });
    } else {
      enquiry.status = "read";
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{enquiry.name}</h1>
          <a href={`mailto:${enquiry.email}`} className="text-sm text-primary hover:underline">
            {enquiry.email}
          </a>
        </div>
        <Badge variant={STATUS_VARIANT[enquiry.status]} className="capitalize">
          {enquiry.status}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        {new Date(enquiry.created_at).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })}
        {" · "}
        {enquiry.turnstile_verified ? "Verification passed" : "Verification not recorded"}
      </p>

      <div className="whitespace-pre-wrap rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed">
        {enquiry.message}
      </div>

      <EnquiryDetailActions id={enquiry.id} status={enquiry.status} />
    </div>
  );
}
