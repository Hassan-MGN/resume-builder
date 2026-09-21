# Resummetry — secure AI and account setup on Vercel

Resummetry sends AI requests through the server function at `/api/ai`. The Gemini API key is never exposed to the browser bundle. Account deletion is handled by `/api/account` using the Supabase service-role key on the server only.

## Vercel environment variables

Server-side:

```text
GEMINI_API_KEY=your-real-gemini-key
GEMINI_MODEL=gemini-3.5-flash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Browser build:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_AI_PROXY_URL=/api/ai
```

Do **not** create `VITE_GEMINI_API_KEY`.

The service-role key must never be placed in a `VITE_*` variable or shipped to the browser.

## Supabase SQL

Run the complete `supabase/resume_documents.sql` script. It creates/updates:

- `resume_documents` with revision and soft-delete fields.
- the private `resume-pdfs` bucket and per-user storage policies.
- `ai_usage` and the `consume_ai_usage` RPC for durable AI quotas.

The RPC uses `auth.uid()` from the caller's bearer token, so a user cannot consume another user's quota.

## AI security model

The browser sends an operation name and structured input. The server constructs the provider prompt itself. Client-supplied prompt text, temperature, response schema, and MIME configuration are not trusted.

The server enforces:

- authenticated Supabase sessions.
- per-window AI quota.
- per-day AI quota.
- request-size and action-specific input limits.
- fixed response configuration for each named operation.
- untrusted-document boundaries for CV/resume text.

The browser also has a small local rate guard for UX, but the server quota is the security boundary.

## Local development

The standard Vite dev server now has a development-only bridge for `/api/ai` and `/api/account`, so you can normally use:

```bash
npm run dev
```

For a runtime-level Vercel test, you can still use:

```bash
npm run dev:vercel
```
