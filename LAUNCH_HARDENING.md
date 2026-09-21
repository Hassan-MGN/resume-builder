# Resummetry launch hardening

This build includes the main application-side hardening for persistence, AI access, PDF export, import safety, account deletion, and automated regression checks.

## Implemented in this build

- Account-scoped browser storage with safe write handling.
- Durable local outbox/tombstones for cloud synchronization.
- Revision-based conditional cloud writes to prevent stale overwrites.
- Soft-delete cloud records so offline deletes cannot silently resurrect.
- Explicit legacy-browser-data import; old data is never silently assigned to the first account.
- Stable completed-PDF storage paths based on user ID and resume ID.
- Cleanup/rollback for failed PDF uploads and metadata synchronization.
- Photo resizing/compression before browser persistence.
- Bundled PDF worker; CV import no longer depends on a CDN worker.
- CV import limits and PDF/DOCX-only validation.
- Server-side named AI operations; arbitrary client prompts/config/schema are ignored.
- Durable Supabase-backed AI quota RPC with in-memory fallback.
- Prompt-injection-resistant boundaries for resume/CV text.
- User-scoped client AI rate guard.
- Generic password-reset errors and explicit email-verification signup handling.
- Telemetry URL redaction (pathname only; no query/hash secrets).
- Stable editor entry IDs for object-array editing.
- Central PDF template registry and preserved certificate/language fields.
- Deterministic pagination with no empty-page emission and no data-dropping safety fallback.
- Account deletion endpoint that removes stored PDFs, database documents, and the auth user.
- Regression QA for pagination/data preservation, PDF mappings, AI hardening, telemetry, SQL configuration, and repository configuration.

## Required production setup

1. Replace the example production domain in `public/robots.txt` and `public/sitemap.xml`.
2. Run the full `supabase/resume_documents.sql` script in the production Supabase project. It now also creates the `ai_usage` table and `consume_ai_usage` RPC.
3. Configure these server variables in Vercel/your server:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (optional)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for account deletion; server-side only)
4. Configure browser variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_AI_PROXY_URL=/api/ai` (optional)
5. Configure Supabase Auth email redirect URLs, including `/reset-password`.
6. Verify two separate user accounts cannot read or write each other's documents/PDFs.
7. Run `npm ci`, `npm run build`, and `npm run qa` on a clean machine with the required browser binary available.
8. Run visual QA with a valid Playwright `STORAGE_STATE` for protected builder/dashboard/template/profile scenarios. Without storage state, the visual suite intentionally skips protected routes rather than reporting false success.
9. Keep real secrets out of all `VITE_*` variables except public Supabase client configuration.
10. Add final production support/contact details and have Privacy Policy/Terms reviewed before public launch.

## Important deployment behavior

The standard Vite development server includes a development-only bridge for `/api/ai` and `/api/account`. `npm run dev` is sufficient for normal local testing. `npm run dev:vercel` can still be used when you specifically want to test the Vercel runtime itself.
