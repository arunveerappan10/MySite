import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getCertifications } from "@/lib/queries/certifications";
import { getEducationEntries } from "@/lib/queries/education";
import { getUnreadEnquiryCount } from "@/lib/queries/enquiries";
import { getExperienceEntries } from "@/lib/queries/experience";
import { getInterests } from "@/lib/queries/interests";
import { getProjects } from "@/lib/queries/projects";
import { getRecognitions } from "@/lib/queries/recognitions";
import { getSkillGroups } from "@/lib/queries/skill-groups";
import { getSocialLinks } from "@/lib/queries/social-links";
import { getTestimonials } from "@/lib/queries/testimonials";

/** null count = that collection's query failed; rendered as "—" rather than taking down the page. */
async function countOf(query: () => Promise<{ length: number }[] | unknown[]>) {
  try {
    const rows = await query();
    return rows.length;
  } catch {
    return null;
  }
}

async function resultOf(query: () => Promise<number>) {
  try {
    return await query();
  } catch {
    return null;
  }
}

export default async function DashboardHomePage() {
  const [
    unreadEnquiries,
    projects,
    experience,
    skillGroups,
    recognitions,
    testimonials,
    certifications,
    education,
    interests,
    socialLinks,
  ] = await Promise.all([
    resultOf(getUnreadEnquiryCount),
    countOf(getProjects),
    countOf(getExperienceEntries),
    countOf(getSkillGroups),
    countOf(getRecognitions),
    countOf(getTestimonials),
    countOf(getCertifications),
    countOf(getEducationEntries),
    countOf(getInterests),
    countOf(getSocialLinks),
  ]);

  const overview = [
    { label: "Unread enquiries", count: unreadEnquiries },
    { label: "Projects", count: projects },
    { label: "Experience", count: experience },
    { label: "Skill groups", count: skillGroups },
    { label: "Recognitions", count: recognitions },
    { label: "Testimonials", count: testimonials },
    { label: "Certifications", count: certifications },
    { label: "Education", count: education },
    { label: "Interests", count: interests },
    { label: "Social links", count: socialLinks },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Published counts across every collection.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {overview.map((item) => (
          <Card key={item.label} className="p-4">
            <div className="text-2xl font-display">{item.count ?? "—"}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {item.label}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/enquiries" className="text-sm text-primary hover:underline">
          Review enquiries →
        </Link>
        <Link href="/admin/profile" className="text-sm text-primary hover:underline">
          Edit Hero / About / Contact copy →
        </Link>
        <Link href="/admin/settings" className="text-sm text-primary hover:underline">
          Edit site settings →
        </Link>
        <Link href="/admin/sections" className="text-sm text-primary hover:underline">
          Reorder / relabel sections →
        </Link>
      </div>
    </div>
  );
}
