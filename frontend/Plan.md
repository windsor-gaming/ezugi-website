# Plan — Careers, Contact & HR Admin

Scope: three pieces on top of the existing landing page (`frontend/`, React 19 + Vite, no router/backend yet).

1. **Careers Page** — public, lists open vacancies
2. **Contact Page** — public, contact form / details
3. **HR side** — internal area where HR can add/manage **Reviews** (shown publicly, e.g. on the landing page or Careers page) and **Career vacancies** (feeds the Careers page)

## 0. Foundations needed first (nothing below exists yet)

- [ ] `react-router-dom` — no router is installed; `App.jsx` currently just renders a static stack of sections
- [ ] `src/pages/` folder, one subfolder per page (mirrors the existing `src/components/ComponentName/ComponentName.jsx + .css` pattern)
- [ ] `src/layouts/MainLayout.jsx` — wraps `Navbar` + `<Outlet />` + new `Footer` (no Footer exists today)
- [ ] Wire up the dead `Careers` / `Contact` links in `Navbar.jsx` (currently `href="#"`) to real routes
- [ ] `src/services/` (or `api/`) — no fetch/axios layer exists; needed for vacancies + reviews data
- [ ] Decide data source for now: static/mock JSON to start, swap for a real API later (ask if there's already a backend/endpoint planned)

## 1. Careers Page (`src/pages/Careers/Careers.jsx`)

- Fetches vacancy list from the services layer (mock JSON first)
- Reuses the site's existing visual language: CSS custom properties from `index.css` (`--bg`, `--text`, `--accent`, `--border`), scroll-reveal pattern (`IntersectionObserver` + `in-view` class) used in `WhoWeAre`/`Services`
- Each vacancy: title, department, location, short description, "Apply" CTA (mailto or form link — confirm)
- Empty state when HR hasn't published any vacancies yet

## 2. Contact Page (`src/pages/Contact/Contact.jsx`)

- Contact form (name, email, message) + company details/socials
- No form library in the project yet — plain controlled `useState` inputs, matching `Navbar`'s existing search-form pattern
- Submit target TBD (mailto, form endpoint, or same services layer as Careers) — confirm with backend/HR requirements

## 3. HR side — Supabase-backed (Reviews + Vacancies + Applications)

**Decision: Supabase** (hosted Postgres + Auth + Storage), chosen over Firebase because the data is relational (applications belong to vacancies, HR filters by status/date) — a natural fit for SQL + Row Level Security, vs. Firestore's document model.

### Data model (Postgres tables in Supabase)

- **`vacancies`** — `id, title, area, location, type, summary, about, responsibilities (jsonb), requirements (jsonb), status ('active'|'inactive'), created_at, updated_at`. `status` is the HR-facing enable/disable toggle — only `active` vacancies show on the public Careers page.
- **`applications`** — `id, vacancy_id (fk), full_name, email, phone, cover_note, cv_path (Storage path), status ('new'|'reviewed'|'shortlisted'|'rejected'), created_at`. Filled by the public Apply form; only HR can read.
- **`reviews`** — `id, author_name, author_title, rating, content, status ('published'|'draft'), created_at`. HR-managed; only `published` rows show publicly.
- **Storage bucket `cvs`** — applicants can upload (insert-only), only HR (authenticated) can read/download.
- **HR accounts** — Supabase Auth (email/password). **No public signup** — accounts created manually via the Supabase dashboard (or a one-time invite), since this is a small internal team, not a public user base.

### Row Level Security (the actual access control — enforced in Postgres, not just in the UI)

- Public (anon): `SELECT` on `vacancies` where `status = 'active'`; `SELECT` on `reviews` where `status = 'published'`; `INSERT` only on `applications`; `INSERT` only on the `cvs` storage bucket.
- Authenticated (HR): full `SELECT/INSERT/UPDATE/DELETE` on all three tables; `SELECT` on `cvs`.

### Frontend additions

- `src/lib/supabaseClient.js` — client init from `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (`.env.local`, gitignored; add `.env.example` with blank values, committed)
- `src/context/AuthContext.jsx` — wraps `supabase.auth`, mirrors the existing `ThemeContext.jsx` provider pattern
- `ProtectedRoute` wrapper for everything under `/hr`
- Routes: `/hr/login`, `/hr` (dashboard shell), `/hr/vacancies` (list + create/edit + active/inactive toggle), `/hr/applications` (list, filter by vacancy/status, view CV, update status), `/hr/reviews` (list + create/edit/delete + published toggle)
- **Careers page** switches from mock `src/data/vacancies.js` to fetching `active` vacancies from Supabase
- **Vacancy detail page**: replace the current `mailto:` Apply button with a real in-page **Apply form** (Name, Email, Phone, optional cover note, CV upload — PDF, size-limited) → inserts into `applications` + uploads the file to the `cvs` bucket
- **Public Reviews display** — needs a home for the published reviews (landing page section vs. own page) — see open questions below

### Phase 2 (after Phase 1 works) — auto-email HR on new application

Supabase Database Webhook on `applications` insert → Edge Function → transactional email API (e.g. Resend) → notifies the careers inbox with applicant details + a link to the CV. Needs its own service signup (Resend, free tier) and API key stored as an Edge Function secret. Not blocking Phase 1 — HR can already see every application in the dashboard without it.

## Suggested build order

1. ~~Add `react-router-dom`, wire real routes for Home/Careers/Contact, fix Navbar links~~ ✅ done
2. ~~Contact Page~~ ✅ done
3. ~~Careers Page (list + vacancy detail, mock data)~~ ✅ done
4. ~~Supabase project setup + schema + RLS policies~~ ✅ done (`backend/supabase/schema.sql`)
5. ~~HR auth: login page + `AuthContext` + `ProtectedRoute`~~ ✅ done (HR = users in `hr_users`, not just any login)
6. ~~HR Vacancies CRUD — swap Careers page over to read from Supabase~~ ✅ done
7. ~~Public Apply form on vacancy detail page~~ ✅ done
8. ~~HR Applications view (list/filter/status/CV download)~~ ✅ done
9. ~~HR Reviews CRUD + public Reviews display~~ ✅ done
10. Phase 2 (optional): auto-email on new application via Resend + Edge Function

Each numbered item = one feature; **commit only after a feature is fully working**, not mid-way.

## Decisions (resolved)

- **Apply form fields**: minimal — Name, Email, Phone, CV upload (required), optional cover note.
- **Reviews placement**: a section on the landing page (Home). This touches `App.jsx`/Home — will be done as a single new self-contained `src/components/Reviews/Reviews.jsx` (my own file, styled/behaving like the other Home sections) with the smallest possible footprint in `App.jsx` (one import + one line in the `/` route, no changes to any existing section's own code) — same minimal-touch approach used for the Careers/Contact routing.
- **Phase 2 auto-email**: later, after Phase 1 (HR dashboard visibility into applications) works. Not blocking.

## Still open / blocking

- **Supabase project**: I can't create a cloud account on your behalf — need you to create a free Supabase project and hand me the Project URL + anon public key (safe to put in frontend `.env`). I can walk you through it step by step.
- Contact form still uses `mailto:` too — once Supabase is in place, should Contact enquiries also be stored in the DB (so someone can review them later), or stay mailto-only? Not required for this HR task, just flagging since it's a similar pattern.
