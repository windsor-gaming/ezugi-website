-- Ezugi website — HR schema (vacancies, applications, reviews)
-- Run once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / DROP ... IF EXISTS throughout.

-- ── Tables ──────────────────────────────────────────────────────────

create table if not exists vacancies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null,
  location text not null,
  type text not null default 'Full-time',
  summary text not null,
  about text,
  responsibilities jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- vacancy_id is nullable: a general application ("Send Your CV", not tied
-- to a specific opening) is stored the same way, with vacancy_id = null and
-- its CV under the 'general/' storage folder instead of a vacancy folder.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid references vacancies(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  cover_note text,
  cv_path text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now()
);

-- was `not null` before general applications existed; safe to re-run
alter table applications alter column vacancy_id drop not null;

create index if not exists applications_vacancy_id_idx on applications(vacancy_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  rating smallint check (rating between 1 and 5),
  content text not null,
  status text not null default 'draft' check (status in ('published', 'draft')),
  created_at timestamptz not null default now()
);

-- keep vacancies.updated_at current on edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists vacancies_set_updated_at on vacancies;
create trigger vacancies_set_updated_at
  before update on vacancies
  for each row execute function set_updated_at();

-- ── Input limits on public submissions ─────────────────────────────
-- Applications are written by anonymous visitors, so cap field sizes in
-- the database rather than trusting the browser form.

do $$
begin
if not exists (select 1 from pg_constraint where conname = 'applications_field_lengths') then
  alter table applications add constraint applications_field_lengths check (
    char_length(full_name) between 1 and 200
    and char_length(email) between 3 and 320
    and email like '%_@_%'
    and (phone is null or char_length(phone) <= 50)
    and (cover_note is null or char_length(cover_note) <= 5000)
    and char_length(cv_path) <= 500
  );
end if;
end $$;

-- ── HR accounts ────────────────────────────────────────────────────
-- Being logged in is NOT enough to be HR: Supabase Auth allows sign-up
-- with the public anon key unless it is disabled in the dashboard. Only
-- users listed in hr_users get HR access. Add HR users from the SQL
-- Editor (see backend/README.md) — there is intentionally no policy that
-- lets anyone insert into this table through the API.

create table if not exists hr_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table hr_users enable row level security;

drop policy if exists "hr read own row" on hr_users;
create policy "hr read own row" on hr_users
  for select to authenticated using (user_id = auth.uid());

create or replace function is_hr()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.hr_users where user_id = auth.uid());
$$;

-- ── Row Level Security ──────────────────────────────────────────────
-- anon = public site visitors. HR = authenticated users present in
-- hr_users (checked via is_hr()). Other authenticated users are treated
-- like the public.

alter table vacancies enable row level security;
alter table applications enable row level security;
alter table reviews enable row level security;

-- vacancies: public can read only active ones; HR can do everything
drop policy if exists "public read active vacancies" on vacancies;
create policy "public read active vacancies" on vacancies
  for select to anon, authenticated using (status = 'active');

drop policy if exists "hr read all vacancies" on vacancies;
create policy "hr read all vacancies" on vacancies
  for select to authenticated using (is_hr());

drop policy if exists "hr insert vacancies" on vacancies;
create policy "hr insert vacancies" on vacancies
  for insert to authenticated with check (is_hr());

drop policy if exists "hr update vacancies" on vacancies;
create policy "hr update vacancies" on vacancies
  for update to authenticated using (is_hr()) with check (is_hr());

drop policy if exists "hr delete vacancies" on vacancies;
create policy "hr delete vacancies" on vacancies
  for delete to authenticated using (is_hr());

-- applications: anyone can submit, but only as a fresh 'new' application,
-- with its CV stored under the matching folder — either the vacancy it's
-- for (and that vacancy must be active), or 'general/' for a CV sent with
-- no specific vacancy in mind. Read/update/delete are HR-only.
drop policy if exists "public submit application" on applications;
create policy "public submit application" on applications
  for insert to anon, authenticated with check (
    status = 'new'
    and (
      (vacancy_id is null and cv_path like 'general/%')
      or (
        vacancy_id is not null
        and cv_path like vacancy_id::text || '/%'
        and exists (
          select 1 from vacancies v
          where v.id = vacancy_id and v.status = 'active'
        )
      )
    )
  );

drop policy if exists "hr read applications" on applications;
create policy "hr read applications" on applications
  for select to authenticated using (is_hr());

drop policy if exists "hr update applications" on applications;
create policy "hr update applications" on applications
  for update to authenticated using (is_hr()) with check (is_hr());

drop policy if exists "hr delete applications" on applications;
create policy "hr delete applications" on applications
  for delete to authenticated using (is_hr());

-- reviews: public can read only published ones; HR can do everything
drop policy if exists "public read published reviews" on reviews;
create policy "public read published reviews" on reviews
  for select to anon, authenticated using (status = 'published');

drop policy if exists "hr read all reviews" on reviews;
create policy "hr read all reviews" on reviews
  for select to authenticated using (is_hr());

drop policy if exists "hr insert reviews" on reviews;
create policy "hr insert reviews" on reviews
  for insert to authenticated with check (is_hr());

drop policy if exists "hr update reviews" on reviews;
create policy "hr update reviews" on reviews
  for update to authenticated using (is_hr()) with check (is_hr());

drop policy if exists "hr delete reviews" on reviews;
create policy "hr delete reviews" on reviews
  for delete to authenticated using (is_hr());

-- ── Storage (CV uploads) ─────────────────────────────────────────────
-- Size and type limits are enforced by the bucket itself, not just the
-- browser: PDFs only, max 5MB.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- uploads must go into the folder of an active vacancy (cvs/<vacancy_id>/...)
-- or the 'general/' folder for a CV sent with no specific vacancy in mind.
drop policy if exists "public upload cvs" on storage.objects;
create policy "public upload cvs" on storage.objects
  for insert to anon, authenticated with check (
    bucket_id = 'cvs'
    and (
      (storage.foldername(name))[1] = 'general'
      or exists (
        select 1 from public.vacancies v
        where v.id::text = (storage.foldername(name))[1] and v.status = 'active'
      )
    )
  );

drop policy if exists "hr read cvs" on storage.objects;
create policy "hr read cvs" on storage.objects
  for select to authenticated using (bucket_id = 'cvs' and public.is_hr());

drop policy if exists "hr delete cvs" on storage.objects;
create policy "hr delete cvs" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs' and public.is_hr());

-- ── Seed: migrate the existing mock vacancies so Careers isn't empty ──
-- Only runs if the table is currently empty, so re-running this script
-- later (e.g. after HR has added real vacancies) won't duplicate rows.

do $$
begin
if not exists (select 1 from vacancies) then

insert into vacancies (title, area, location, type, summary, about, responsibilities, requirements, status)
values
  ('Software Engineer', 'Software Engineering', 'Colombo, Sri Lanka (Hybrid)', 'Full-time',
   'Build and maintain web and enterprise applications for our international clients, working across the full stack.',
   'As a Software Engineer at Ezugi, you will work alongside our technology team to deliver web, mobile and enterprise applications for international clients through our offshore delivery model.',
   '["Develop and maintain web, mobile and enterprise applications","Build and integrate REST APIs and third-party/system integrations","Write clean, tested, maintainable code across the front-end and back-end","Collaborate with QA, DevOps and project management on delivery","Participate in code reviews and technical discussions"]'::jsonb,
   '["Experience with modern web application development","Familiarity with front-end and back-end development practices","Understanding of REST APIs and system integrations","Good communication skills for working with international clients","Ability to work independently within an offshore delivery team"]'::jsonb,
   'active'),
  ('QA Engineer', 'QA & Testing', 'Colombo, Sri Lanka (Hybrid)', 'Full-time',
   'Own functional, regression and automation testing across client projects to ensure high-quality releases.',
   'As a QA Engineer, you will be responsible for quality engineering across client projects — from functional testing through to automation — to make sure every release meets a high bar.',
   '["Plan and execute functional, regression and API testing","Build and maintain automated test suites","Run performance testing where required","Report and track defects through to resolution","Work with engineering teams to maintain quality standards"]'::jsonb,
   '["Experience in functional and regression testing","Exposure to test automation tools/frameworks","Understanding of API testing","Detail-oriented with strong analytical skills","Good communication skills for working with international clients"]'::jsonb,
   'active'),
  ('DevOps Engineer', 'DevOps & Cloud', 'Colombo, Sri Lanka (Hybrid)', 'Full-time',
   'Manage cloud infrastructure, CI/CD pipelines and deployment automation for client technology environments.',
   'As a DevOps Engineer, you will manage cloud infrastructure and deployment automation for our client technology environments, working closely with engineering teams.',
   '["Manage cloud infrastructure and cloud migration projects","Build and maintain CI/CD pipelines","Implement infrastructure automation and containerization (Docker)","Set up monitoring and deployment processes","Support engineering teams with technical operations"]'::jsonb,
   '["Experience with cloud infrastructure (AWS/Azure/GCP)","Familiarity with CI/CD tooling and Docker/containerization","Understanding of infrastructure automation","Problem-solving mindset with attention to reliability","Good communication skills for working with international clients"]'::jsonb,
   'active'),
  ('Digital Marketing Executive', 'Digital Marketing', 'Colombo, Sri Lanka (Hybrid)', 'Full-time',
   'Plan and run social media, content and paid campaigns for clients across multiple industries.',
   'As a Digital Marketing Executive, you will plan and manage digital marketing activities for clients across multiple industries, combining content, social and paid campaigns.',
   '["Plan and execute social media and content campaigns","Support paid search and digital advertising campaigns","Coordinate content creation and campaign scheduling","Monitor campaign performance and report on results","Work with clients across different markets and industries"]'::jsonb,
   '["Experience in social media and/or digital campaign management","Familiarity with content planning and creative content","Basic understanding of SEO and performance marketing","Strong written communication skills","Ability to manage multiple client accounts"]'::jsonb,
   'active'),
  ('Customer Support Executive', 'Customer Support', 'Colombo, Sri Lanka (On-site)', 'Full-time',
   'Deliver voice, email and live chat support for international clients as part of our BPO operations.',
   'As a Customer Support Executive, you will be part of our BPO operations team, delivering voice, email and live chat support to international clients.',
   '["Handle voice, email and live chat customer support","Provide multilingual support where required","Follow customer service processes and quality standards","Escalate and coordinate on unresolved issues","Maintain accurate records of customer interactions"]'::jsonb,
   '["Good spoken and written English communication skills","Prior customer service experience preferred","Comfortable working in a 24/7 operational environment","Ability to handle multiple customer queries efficiently","Team player with a customer-first attitude"]'::jsonb,
   'active'),
  ('Business Operations Associate', 'Business Operations', 'Colombo, Sri Lanka (On-site)', 'Full-time',
   'Support back-office operations, reporting and administrative processes for client accounts.',
   'As a Business Operations Associate, you will support back-office operations for client accounts, including data processing, documentation and reporting.',
   '["Handle data processing, data entry and documentation","Provide administrative support across client accounts","Prepare reports for internal and client use","Support sales administration and follow-up activities","Maintain accurate operational records"]'::jsonb,
   '["Strong attention to detail and organizational skills","Good working knowledge of MS Office/Google Workspace","Prior back-office or administrative experience preferred","Good written and verbal communication skills","Ability to manage multiple tasks and deadlines"]'::jsonb,
   'active');

end if;
end $$;
