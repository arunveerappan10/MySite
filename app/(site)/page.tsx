import { Fragment, type ReactNode } from "react";
import { AboutSection } from "@/components/site/sections/about-section";
import { CertificationsSection } from "@/components/site/sections/certifications-section";
import { ContactSection } from "@/components/site/sections/contact-section";
import { EducationSection } from "@/components/site/sections/education-section";
import { ExperienceSection } from "@/components/site/sections/experience-section";
import { HeroSection } from "@/components/site/sections/hero-section";
import { InterestsSection } from "@/components/site/sections/interests-section";
import { RecognitionSection } from "@/components/site/sections/recognition-section";
import { SkillsSection } from "@/components/site/sections/skills-section";
import { TestimonialsSection } from "@/components/site/sections/testimonials-section";
import { WorkSection } from "@/components/site/sections/work-section";
import type { SectionKey } from "@/lib/constants";
import { getCertifications } from "@/lib/queries/certifications";
import { getEducationEntries } from "@/lib/queries/education";
import { getExperienceEntries } from "@/lib/queries/experience";
import { getInterests } from "@/lib/queries/interests";
import { getProfile } from "@/lib/queries/profile";
import { getProjects } from "@/lib/queries/projects";
import { getRecognitions } from "@/lib/queries/recognitions";
import { getSections } from "@/lib/queries/sections";
import { getSettings } from "@/lib/queries/settings";
import { getSkillGroups } from "@/lib/queries/skill-groups";
import { getSocialLinks } from "@/lib/queries/social-links";
import { getTestimonials } from "@/lib/queries/testimonials";
import type { SectionRow } from "@/lib/types";

export default async function HomePage() {
  const [
    profile,
    settings,
    sections,
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
    getProfile(),
    getSettings(),
    getSections(),
    getProjects(),
    getExperienceEntries(),
    getSkillGroups(),
    getRecognitions(),
    getTestimonials(),
    getCertifications(),
    getEducationEntries(),
    getInterests(),
    getSocialLinks(),
  ]);

  const renderers: Record<SectionKey, (section: SectionRow) => ReactNode> = {
    about: (section) => <AboutSection section={section} profile={profile} />,
    work: (section) => <WorkSection section={section} projects={projects} />,
    experience: (section) => <ExperienceSection section={section} entries={experience} />,
    skills: (section) => <SkillsSection section={section} groups={skillGroups} />,
    recognition: (section) => (
      <RecognitionSection section={section} recognitions={recognitions} />
    ),
    testimonials: (section) => (
      <TestimonialsSection section={section} testimonials={testimonials} />
    ),
    certifications: (section) => (
      <CertificationsSection section={section} certifications={certifications} />
    ),
    education: (section) => <EducationSection section={section} entries={education} />,
    interests: (section) => <InterestsSection section={section} interests={interests} />,
    contact: (section) => (
      <ContactSection
        section={section}
        profile={profile}
        settings={settings}
        socialLinks={socialLinks}
      />
    ),
  };

  const orderedSections = [...sections].sort((a, b) => a.position - b.position);

  return (
    <>
      <HeroSection profile={profile} settings={settings} />
      {orderedSections.map((section) => (
        <Fragment key={section.key}>{renderers[section.key](section)}</Fragment>
      ))}
    </>
  );
}
