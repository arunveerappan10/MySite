import { getAllEnquiriesForAdmin } from "@/lib/queries/enquiries";
import { EnquiryList } from "./enquiry-list";

export default async function EnquiriesAdminPage() {
  const enquiries = await getAllEnquiriesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Contact form submissions.</p>
      </div>
      <EnquiryList enquiries={enquiries} />
    </div>
  );
}
