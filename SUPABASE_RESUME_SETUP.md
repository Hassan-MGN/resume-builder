# Resummetry resume persistence and server-side AI quotas

Resummetry uses a fast account-scoped browser cache and synchronizes authenticated resume documents to Supabase when cloud access is available.

## 1. Create the production schema

Open Supabase → SQL Editor and run the complete:

`supabase/resume_documents.sql`

The script is designed to be re-runnable and now includes:

- `resume_documents.revision` for conditional writes.
- `resume_documents.deleted_at` for offline-safe soft deletion.
- private `resume-pdfs` storage policies.
- durable `ai_usage` counters.
- `consume_ai_usage(...)` security-definer RPC used by `/api/ai`.

RLS remains tied to `auth.uid()` so users can only access their own resume rows/PDFs.

## 2. Browser environment

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_AI_PROXY_URL=/api/ai
```

The legacy `VITE_SUPABASE_API_KEY` variable is still accepted by the storage layer for compatibility, but `VITE_SUPABASE_ANON_KEY` is preferred.

## 3. Server environment

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash
```

The service-role and Gemini keys are server-only.

## 4. Sync behavior

Local changes are persisted immediately. Cloud changes are queued and serialized per document. Conditional writes use the current cloud revision, so stale requests cannot silently overwrite newer cloud data.

Deletes use local tombstones and cloud `deleted_at` values until the server acknowledges the operation. This prevents an offline delete from being resurrected during later hydration.

When local and cloud copies changed independently, the local copy is preserved and the sync state becomes `conflict` rather than silently discarding one side.

## 5. Completed PDF storage

Completed PDFs use a stable path:

`resume-pdfs/<user-id>/<resume-id>/resume.pdf`

The path no longer depends on the resume title, so renaming a resume does not create a new cloud object. Upload failure and metadata failure trigger cleanup rather than intentionally leaving a new orphan PDF behind.

Completed-resume downloads use short-lived signed URLs.

## 6. Legacy browser data

Old unscoped browser data is never silently assigned to the first authenticated user. The dashboard can offer an explicit import into the currently signed-in account.

## 7. Account deletion

The Profile page exposes a permanent account-deletion action. `/api/account` verifies the current bearer token, removes the user's stored resume PDFs, deletes resume rows, and finally deletes the auth account. Set `SUPABASE_SERVICE_ROLE_KEY` only on the server.
