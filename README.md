# Resummetry

Resummetry is a resume/CV builder built with React and Vite, with Supabase-backed persistence and server-side Gemini AI features.

## Main capabilities

- 11 resume templates.
- Editable structured resume sections.
- Local-first browser persistence.
- Authenticated Supabase cloud synchronization.
- PDF export with template-aware rendering.
- PDF/DOCX CV import.
- AI enhancement, proofreading, bullet generation, tone rewriting, action-verb suggestions, ATS analysis, and CV parsing.
- Account deletion and private completed-PDF storage.

## Development

Install the locked dependency set:

```bash
npm ci
```

Run Vite:

```bash
npm run dev
```

The standard Vite dev server now includes a small development-only bridge for `/api/ai` and `/api/account`, so the normal command is enough:

```bash
npm run dev
```

You can still use `npm run dev:vercel` when you want to test the Vercel runtime itself.

## Verification

```bash
npm run lint
npm run build
npm run qa:regression
npm run qa:templates
npm run qa:visual
```

`npm run qa` runs all regression, template, and visual checks.

Protected visual routes require Playwright `STORAGE_STATE` so the suite never mistakes a sign-in redirect for a successfully tested builder page.

## Environment

Copy `.env.example` to your local environment. `VITE_*` variables are browser-visible; never put Gemini or Supabase service-role secrets in them.

See `LAUNCH_HARDENING.md`, `SUPABASE_RESUME_SETUP.md`, and `VERCEL_AI_SETUP.md` for production setup and security requirements.
