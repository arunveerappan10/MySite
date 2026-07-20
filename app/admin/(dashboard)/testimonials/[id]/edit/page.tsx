import { notFound } from "next/navigation";
import { getTestimonialByIdForAdmin } from "@/lib/queries/testimonials";
import { TestimonialForm } from "../../testimonial-form";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialByIdForAdmin(id);
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Edit testimonial</h1>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
