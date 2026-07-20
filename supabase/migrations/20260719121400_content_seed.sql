-- Seeds every table with the reference site's exact current content, verbatim
-- (including placeholder-looking values like the example.com email) — real values get
-- edited later via the admin dashboard, not now.
--
-- This ships as a migration rather than supabase/seed.sql because `supabase db push` to
-- a remote project silently skips seed.sql, and this content is meant to land in the real
-- production database, not just a local dev reset.

insert into public.profile (
  id, full_name, hero_accent_word, hero_eyebrow, hero_subheading, hero_stats,
  about_summary, email, phone, location, availability_note, contact_intro, image_url
) values (
  1,
  'Arun Veerappan T',
  'Veerappan',
  'Software Engineer · Chennai, IN',
  'Production Support Engineer keeping mission-critical enterprise systems reliable, cost-efficient, and quietly observable across energy and insurance domains.',
  '[
    {"label":"Experience","value":"4.5+ yrs"},
    {"label":"SLA adherence","value":"100%"},
    {"label":"Manual effort","value":"−75%"},
    {"label":"Infra savings","value":"£400+/mo"}
  ]'::jsonb,
  'Production Support Engineer with 4.5+ years of experience managing mission-critical enterprise applications across energy and insurance domains. Expertise in ITIL service management, incident lifecycle management, and automation-driven operations. Proven track record of improving system reliability, reducing incident volume, and optimizing infrastructure costs. Skilled in log analysis, monitoring, cloud operations, and proactive issue resolution, with a strong focus on delivering measurable business impact.',
  'arunveerappan.t@example.com',
  '+91 90809 85972',
  'Chennai, Tamil Nadu, India',
  'Selective, considered',
  'For roles, collaborations, or professional inquiries — please use the form or reach out directly through any of the channels below. Responses within one business day.',
  null
)
on conflict (id) do nothing;

insert into public.settings (
  id, site_title, site_description, og_image_url, resume_file_url,
  footer_bio, footer_tagline, nav_cta_label, nav_cta_href
) values (
  1,
  'Arun Veerappan T — Software Engineer',
  'Portfolio of Arun Veerappan T, a Software Engineer specializing in production support, ITIL service management, and automation across energy and insurance domains.',
  null,
  null, -- upload the resume via the admin dashboard (Phase E) or Supabase Storage directly, then set this
  'Production Support Engineer · Reliability, automation, and analytics for enterprise systems that cannot afford to fail.',
  'Designed with restraint',
  'Get in touch',
  '#contact'
)
on conflict (id) do nothing;

insert into public.sections (key, eyebrow, heading, nav_label, position) values
  ('about', 'Summary', 'A short profile, {{in his own words}}.', 'About', 10),
  ('work', 'Impact Work', 'Work that moved the {{needle}}.', 'Work', 20),
  ('experience', 'Experience', 'A focused {{track record}}.', 'Experience', 30),
  ('skills', 'Capabilities', 'Toolkit, {{grouped by intent}}.', 'Skills', 40),
  ('recognition', 'Recognition', 'Awards & {{acknowledgements}}.', 'Recognition', 50),
  ('testimonials', 'Testimonials', 'What {{people say}}.', null, 60),
  ('certifications', 'Certifications', 'Credentials {{in rotation}}.', null, 70),
  ('education', 'Education', 'Where the {{foundations}} were laid.', null, 80),
  ('interests', 'Other Interests', 'Off the clock, {{still curious}}.', null, 90),
  ('contact', 'Contact', 'Open to {{meaningful engagements}}.', null, 100)
on conflict (key) do nothing;

insert into public.social_links (platform, label, url, icon, position) values
  ('linkedin', '/in/arunveerappan', 'https://www.linkedin.com/', 'linkedin', 10);

insert into public.projects (title, tag, problem, role, approach, outcome, metrics, position) values
(
  'Infrastructure Rightsizing — UK Energy Platform',
  'Cost Optimization',
  'Production servers were provisioned for peak load that never materialized. CPU and memory sat idle while the client absorbed the bill.',
  'Sole operations engineer on capacity analysis and vendor coordination.',
  'Instrumented long-window utilization sampling across the cluster, correlated with business seasonality, and modeled a right-sized footprint against SLA guardrails.',
  '~£400+ / month recurring infrastructure savings with zero SLA regression.',
  '[{"label":"Monthly savings","value":"£400+"},{"label":"SLA impact","value":"0 breaches"},{"label":"Scope","value":"Prod cluster"}]'::jsonb,
  10
),
(
  'Automation of Operational Health Checks',
  'Automation',
  'Analysts spent hours each shift running the same availability probes and exception scans across a sprawling application estate.',
  'Author and owner of the automation suite.',
  'Built Python/shell scripts to consolidate service-availability checks, exception harvesting, and structured reporting into scheduled runs feeding a single dashboard.',
  'Manual operational effort reduced by ~75%; incidents surfaced hours earlier.',
  '[{"label":"Manual effort","value":"−75%"},{"label":"Coverage","value":"Full estate"},{"label":"Cadence","value":"Continuous"}]'::jsonb,
  20
),
(
  'Power BI Command Center for a Mission-Critical App',
  'Analytics',
  'Incident trends were invisible until postmortems. Repeat issues kept re-entering the queue with no shared view of the pattern.',
  'Designer and implementer, working directly with the Service Owner.',
  'Modeled the incident dataset, defined the KPIs that actually moved the needle, and shipped a Power BI dashboard driving weekly service reviews.',
  'Incident inflow down 33%, turnaround time down ~25%. Service Owner appreciation on record.',
  '[{"label":"Incident inflow","value":"−33%"},{"label":"Turnaround","value":"−25%"},{"label":"Recognition","value":"Service Owner"}]'::jsonb,
  30
),
(
  'Access Governance Scheduler',
  'Security',
  'Inactive accounts were accumulating access to production data — a compliance liability and a manual review burden.',
  'Designed and shipped the scheduler end-to-end.',
  'Built a database scheduler job that revokes inactive users on a defined policy and publishes periodic access reports to stakeholders.',
  '~40% less manual administration effort and a cleaner audit posture.',
  '[{"label":"Admin effort","value":"−40%"},{"label":"Cadence","value":"Automated"},{"label":"Audit","value":"Report-ready"}]'::jsonb,
  40
),
(
  'Monitoring & Alerting Gap Closure',
  'Reliability',
  'Silent failures — cluster degradation, file-processing stalls — were only caught downstream by users.',
  'Identified gaps and drove the alerting rollout.',
  'Mapped failure modes to observable signals, added AppDynamics health rules and targeted alerts, and validated against historical incidents.',
  'Proactive detection replaced reactive triage on the highest-impact failure classes.',
  '[{"label":"Detection","value":"Proactive"},{"label":"Coverage","value":"Critical paths"},{"label":"Toolchain","value":"AppDynamics"}]'::jsonb,
  50
),
(
  'Database → SAP Data Migration',
  'Migration',
  'Application data needed to land in SAP with integrity intact and minimal disruption to a live business.',
  'Point of contact coordinating migration execution.',
  'Owned data-mapping validation, reconciliation checks, and cutover coordination across application, DBA, and SAP teams.',
  'Migration delivered with data integrity preserved and negligible business impact.',
  '[{"label":"Integrity","value":"Preserved"},{"label":"Downtime","value":"Minimal"},{"label":"Stakeholders","value":"Multi-team"}]'::jsonb,
  60
);

insert into public.experience_entries (company, domain, role_title, period_label, duration_label, impact_bullets, highlights, tech_stack, position) values
(
  'Cognizant · Chennai',
  'Energy · UK',
  'Software Engineer — Energy Services (United Kingdom)',
  'Oct 2023 — June 2026',
  '2y 8m',
  '[
    "Managed end-to-end ITIL service management via ServiceNow — Incident, Problem, Change — with 100% SLA adherence.",
    "Reduced manual operational effort by ~75% via Python/shell automation for availability checks and exception monitoring.",
    "Delivered ~£400/mo infrastructure savings through rightsizing based on CPU/memory utilization analysis.",
    "Built a database scheduler job for access governance, cutting admin effort by ~40%.",
    "Closed silent-failure alerting gaps end-to-end across cluster and file-processing paths.",
    "Served as Knowledge Manager — KT reach of 110+ associates."
  ]'::jsonb,
  '[{"label":"SLA","value":"100%"},{"label":"Manual effort","value":"−75%"},{"label":"Infra savings","value":"£400/mo"}]'::jsonb,
  '["ServiceNow","Python","AWS","AppDynamics","MySQL"]'::jsonb,
  10
),
(
  'Cognizant · Chennai',
  'Insurance · Japan',
  'Software Engineer — Insurance Services (Japan)',
  'Oct 2021 — Mar 2023',
  '1y 6m',
  '[
    "Owned incident triage for web and Control-M batch estate under ITIL practices.",
    "Raised WRQs in JIRA with root-cause findings and proposed code fixes, meaningfully reducing repeat incidents.",
    "Designed UAT test cases, reproduced production defects, and validated fixes pre-release.",
    "Executed SQL scripts for data correction and preventive maintenance."
  ]'::jsonb,
  '[{"label":"Repeat incidents","value":"Reduced"},{"label":"Batch estate","value":"Owned"},{"label":"Releases","value":"Validated"}]'::jsonb,
  '["JIRA","Control-M","SQL","UAT"]'::jsonb,
  20
);

insert into public.skill_groups (group_name, icon, items, position) values
('ITSM', 'activity', '["Incident","Problem","Change","Service Request","ServiceNow","JIRA"]'::jsonb, 10),
('Automation & Languages', 'zap', '["Python","Java","Spring Boot","Shell / Crontab"]'::jsonb, 20),
('Data', 'database', '["MySQL","SQL scripting","Power BI"]'::jsonb, 30),
('Cloud & Monitoring', 'cloud', '["AWS","AppDynamics","GitHub"]'::jsonb, 40);

insert into public.recognitions (icon, title, body, position) values
('trophy', 'Power BI Dashboard — Service Owner Appreciation', 'Designed and implemented a Power BI dashboard for a mission-critical application. Incident turnaround reduced by ~25% and incident inflow by 33%.', 10),
('award', 'Change Maker Award — Cognizant', 'Recognized for exceptional contributions to organizational outreach activities.', 20),
('sparkles', 'Guinness World Record Contribution', 'Contributed to the largest online Generative AI hackathon — Vibe coding with GitHub Copilot, showcasing GenAI-assisted development at scale.', 30);

insert into public.certifications (name, issuer, credential_id, validity_label, verify_url, position) values
('AWS Certified Cloud Practitioner', 'Amazon Web Services', 'CLF-C02', '3 years from issue', 'https://aws.amazon.com/verification', 10),
('Microsoft Azure Fundamentals', 'Microsoft', 'AZ-900', 'Lifetime', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/', 20),
('Microsoft AI Business Professional', 'Microsoft', 'AB-730', 'Lifetime', 'https://learn.microsoft.com/en-us/credentials/', 30),
('Power BI Data Analyst Associate', 'Microsoft', 'PL-300', '1 year from issue', 'https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/', 40),
('GitHub Copilot Certification', 'GitHub', 'GH-300', 'Per credential terms', 'https://examregistration.github.com/certification/COPILOT', 50),
('Cognizant Certified Gen AI Voyager', 'Cognizant', 'CGN-GAV', 'Internal credential', 'https://www.cognizant.com/', 60);

insert into public.education_entries (school, degree, period_label, score_label, position) values
('PSNA College of Engineering and Technology', 'B.E., Electronics & Communication Engineering', 'Aug 2017 — Aug 2021', 'CGPA 8.1', 10),
('PKN Higher Secondary School, Madurai', 'Higher Secondary Certificate (HSC)', 'Jun 2016 — Mar 2017', '90.4%', 20);

insert into public.interests (label, icon, position) values
('Exploring AI Tools', 'brain', 10),
('Playing Chess', 'puzzle', 20),
('Solving Sudoku', 'grid', 30),
('Volunteering', 'heart-handshake', 40);

-- testimonials: intentionally left empty — no equivalent content exists in the reference
-- site. Add the first one via the admin dashboard whenever you have one.
