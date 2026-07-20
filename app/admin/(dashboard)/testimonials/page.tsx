import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTestimonialsForAdmin } from "@/lib/queries/testimonials";
import { TestimonialList } from "./testimonial-list";

export default async function TestimonialsAdminPage() {
  const testimonials = await getAllTestimonialsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Renders nothing on the public site while empty.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4" />
            New testimonial
          </Link>
        </Button>
      </div>
      <TestimonialList testimonials={testimonials} />
    </div>
  );
}
