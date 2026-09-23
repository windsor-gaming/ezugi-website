# Ezugi — Backend

The backend is hosted on [Supabase](https://supabase.com) (Postgres + Auth + Storage). There is no custom server; the frontend talks to Supabase directly, and access control is enforced by Row Level Security policies in the database.

## Contents

- `supabase/schema.sql` — tables (`vacancies`, `applications`, `reviews`, `hr_users`), RLS policies, the private `cvs` storage bucket (PDF only, 5MB max), input limits, and seed vacancies.
- `supabase/functions/send-contact-email/` — Edge Function that emails the Contact form to HR (via [Resend](https://resend.com)). Nothing opens on the visitor's machine; the email is sent server-side.

## Setup

1. In the Supabase Dashboard, open **SQL Editor → New query**, paste `supabase/schema.sql`, and run it. It is safe to re-run after changes.
2. **Disable public sign-ups**: **Authentication → Sign In / Providers → Email**, turn off **Allow new users to sign up**.
3. Create each HR account under **Authentication → Users → Add user** (tick "Auto Confirm User").
4. Grant that account HR access by running this in the SQL Editor (replace the email):

   ```sql
   insert into hr_users (user_id)
   select id from auth.users where email = 'hr@example.com'
   on conflict do nothing;
   ```

   Logging in is not enough on its own — only users listed in `hr_users` can see applications, CVs, or edit vacancies and reviews. To revoke access, `delete from hr_users where user_id = ...`.
5. Copy the project URL and anon key into `frontend/.env.local` (see `frontend/.env.example`).
6. Set up the Contact form email (see below).

## Contact form email (Resend + Edge Function)

The Contact page and the Careers "Send Your CV" enquiry don't open the visitor's mail app — the browser calls a Supabase Edge Function, which sends the email itself using [Resend](https://resend.com)'s API. This needs a one-time setup:

1. **Get a Resend API key** (free tier: 100 emails/day, 3,000/month — plenty for a contact form):
   - Sign up at [resend.com](https://resend.com).
   - **API Keys → Create API Key** (Sending access is enough). Copy it — it's only shown once.
   - No domain verification needed to start: Resend lets you send *from* `onboarding@resend.dev` to any address without one. Once `ezugi.lk` (or whichever domain) is confirmed, verify it in Resend under **Domains** and the function can send from a real `@ezugi.lk` address instead — see the `CONTACT_FROM_EMAIL` secret below.

2. **Deploy the function.** Easiest way — no CLI install needed:
   - Supabase Dashboard → **Edge Functions** → **Deploy a new function** → name it `send-contact-email`.
   - Paste in the contents of `supabase/functions/send-contact-email/index.ts`.
   - Deploy.

   (Alternatively, with the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and `supabase login` / `supabase link --project-ref <ref>` done from this `backend/` folder: `supabase functions deploy send-contact-email`.)

3. **Set the secrets** the function reads — Dashboard → **Edge Functions → Manage secrets** (or `supabase secrets set NAME=value` via CLI):

   | Secret | Required | Purpose |
   | --- | --- | --- |
   | `RESEND_API_KEY` | Yes | The API key from step 1. |
   | `CONTACT_TO_EMAIL` | No (defaults to `akeshioff@gmail.com`) | Inbox that receives enquiries — update once the real one is confirmed. |
   | `CONTACT_FROM_EMAIL` | No (defaults to `Ezugi Website <onboarding@resend.dev>`) | Sender shown to the recipient. Must stay `onboarding@resend.dev` until a domain is verified in Resend — any other address is rejected until then. |

4. **Turn off "Enforce JWT Verification"** for this function (Dashboard → Edge Functions → `send-contact-email` → settings). It's called by anonymous visitors; with this on, the browser's CORS preflight gets rejected before the function runs, which shows up as a CORS error in the browser console.

5. Test it by submitting the Contact form. If it fails, check **Edge Functions → send-contact-email → Logs** in the dashboard — the function logs Resend's error there.

No CORS/domain allow-list changes are needed for this to work locally or once deployed, since the function currently allows any origin. Once the real domain is live, tighten `CORS_HEADERS` in `index.ts` to that domain and redeploy.

## Security model

| Who | Can do |
| --- | --- |
| Public visitor | Read active vacancies and published reviews. Submit an application (status is forced to `new`, only against an active vacancy) and upload one PDF CV into that vacancy's folder. |
| HR (`hr_users`) | Full access to vacancies, applications, reviews; read and delete CVs. |
| Any other signed-in user | Same as a public visitor. |
