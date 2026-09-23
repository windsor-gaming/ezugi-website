// Sends the Contact page enquiry by email, server-side — the visitor's
// browser never opens a mail app. Runs as a Supabase Edge Function so the
// Resend API key never reaches the frontend bundle.
//
// This function must have "Enforce JWT Verification" turned OFF (Dashboard:
// Edge Functions -> send-contact-email -> settings; CLI: config.toml sets
// verify_jwt = false). It's called by anonymous visitors, and a browser's
// CORS preflight (OPTIONS) never carries a token — with JWT verification
// on, Supabase rejects that preflight before this code ever runs, which
// the browser reports as a CORS error.
//
// Secrets needed (set once, see backend/README.md):
//   RESEND_API_KEY   — from https://resend.com (free tier is enough)
//   CONTACT_TO_EMAIL — inbox that receives enquiries (defaults below)
//   CONTACT_FROM_EMAIL — sender shown to the recipient (defaults below;
//     until a domain is verified in Resend, this must stay
//     "onboarding@resend.dev" — Resend rejects any other from-address)

import { Resend } from 'npm:resend@4'

const TO_EMAIL = Deno.env.get('CONTACT_TO_EMAIL') || 'akeshioff@gmail.com'
const FROM_EMAIL = Deno.env.get('CONTACT_FROM_EMAIL') || 'Ezugi Website <onboarding@resend.dev>'

// Tighten this to the real site origin once it has a domain.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_LEN = { name: 200, company: 200, email: 320, telephone: 50, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // Everything below can throw (bad JSON, a misconfigured secret, a network
  // blip talking to Resend) — caught here so a failure always comes back as
  // a normal JSON response with CORS headers, never an unhandled crash that
  // the browser reports as a CORS error instead of the real problem.
  try {
    const body = await req.json().catch(() => {
      throw new Response(null, { status: 400 })
    })

    const name = String(body.name ?? '').trim()
    const company = String(body.company ?? '').trim()
    const email = String(body.email ?? '').trim()
    const telephone = String(body.telephone ?? '').trim()
    const services = Array.isArray(body.services) ? body.services.map(String).slice(0, 10) : []
    const message = String(body.message ?? '').trim()
    // Honeypot: a hidden field real visitors never fill in; bots that fill
    // every input do. Report success so they don't learn to skip it.
    const honeypot = String(body.website ?? '').trim()

    if (honeypot) return json({ ok: true })

    if (!name || name.length > MAX_LEN.name) return json({ error: 'Please provide your name.' }, 400)
    if (!email || email.length > MAX_LEN.email || !EMAIL_RE.test(email)) {
      return json({ error: 'Please provide a valid email address.' }, 400)
    }
    if (company.length > MAX_LEN.company) return json({ error: 'Company name is too long.' }, 400)
    if (telephone.length > MAX_LEN.telephone) return json({ error: 'Phone number is too long.' }, 400)
    if (!message || message.length > MAX_LEN.message) {
      return json({ error: 'Please provide a message.' }, 400)
    }

    const apiKey = Deno.env.get('RESEND_API_KEY')
    if (!apiKey) {
      console.error('RESEND_API_KEY secret is not set on this function.')
      return json({ error: 'Email sending is not configured yet.' }, 500)
    }

    const html = `
      <h2>New enquiry from ${escapeHtml(name)}</h2>
      <p><strong>Company:</strong> ${escapeHtml(company) || '—'}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(telephone) || '—'}</p>
      <p><strong>Service(s):</strong> ${services.map(escapeHtml).join(', ') || '—'}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `Enquiry from ${name}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return json({ error: 'Could not send your enquiry. Please try again shortly.' }, 502)
    }

    return json({ ok: true })
  } catch (e) {
    if (e instanceof Response) return json({ error: 'Invalid request body.' }, e.status)
    console.error('Unexpected error:', e)
    return json({ error: 'Something went wrong. Please try again shortly.' }, 500)
  }
})
