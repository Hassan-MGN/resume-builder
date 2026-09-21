# Resummetry Hardened Update

This package contains a safety-focused maintenance update addressing the reliability, data-integrity, export, AI-abuse, authentication, privacy, and QA issues identified during the full project review.

## Important deployment steps

1. Apply `supabase/resume_documents.sql` to the project's Supabase database. The script adds document revisions/deletion state and the server-side AI usage table/RPC.
2. Configure the server-only variables from `.env.example`, especially `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service-role key as a `VITE_*` variable.
3. Run `npm ci` from a clean environment, then `npm run lint`, `npm run build`, and `npm run qa` before production deployment.
4. For existing users, the dashboard now requires explicit confirmation before importing legacy browser-stored resume data into an authenticated account.

## Main fixes

- Account-scoped local storage, serialized cloud writes, revisions, stale-write protection, deletion tombstones, and a retryable sync outbox.
- Explicit legacy-data import instead of silently attaching old browser data to the first account that logs in.
- Stable completed-PDF storage paths based on user ID + resume ID, with upload rollback and previous-file cleanup.
- Safer image processing to keep profile photos small enough for reliable browser storage.
- PDF export mappings now preserve certificate details, language proficiency, credentials, safe links, and selected font families.
- All 11 PDF template IDs have explicit renderer configurations; invalid template IDs safely fall back to Professional.
- Pagination was rewritten for deterministic forward progress, with no empty emitted pages and guards against pathological inputs.
- CV import now supports PDF/DOCX consistently, bundles its PDF worker, caps file/pages/text size, and treats CV contents as untrusted data.
- AI requests are authenticated server-side, restricted to named resume operations, bounded by server-side input/output limits, and no longer trust client-supplied prompts/configuration.
- Durable AI usage limits are backed by Supabase with an in-memory fallback only when the RPC is unavailable.
- Account deletion removes private resume PDFs, database rows, and the auth account through a server-only service-role endpoint.
- Auth flows avoid exposing raw backend errors and correctly handle email-verification signups and password recovery.
- Error telemetry no longer sends URL query/hash values that could contain recovery/authentication material.
- QA now exercises all 11 templates, large resumes, pagination/data preservation, export mappings, auth/AI hardening, telemetry, and repository configuration.

## Validation performed in the package build

- Regression QA: PASS.
- Pagination stress across all 11 templates: PASS; no empty pages and no source object-array data loss detected.
- JavaScript syntax checks for server utilities and key utilities: PASS.
- Clean `npm ci` / full Vite build could not be completed inside the build sandbox because the dependency download process timed out. This is an environment/network limitation, not a claimed production-build pass.


## Local API 404 fix

The normal Vite development server now includes a development-only API bridge for `/api/ai` and `/api/account`. This prevents the common local `404` caused by calling Vercel-style serverless functions from a plain Vite dev server. Server-only environment variables are loaded into the Vite server process for local handlers and are never injected into the browser bundle.
