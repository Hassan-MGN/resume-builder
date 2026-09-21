# Lint Fix Patch

This patch addresses the blocking ESLint errors reported by the local project.

## Fixed blockers

- Added Node globals to the flat ESLint configuration so `process` and `Buffer` in Vercel/API/Vite code are valid.
- Removed the undefined `localMap.delete(...)` reference in `resumeStorage.js`.
- Fixed Rules of Hooks violations in `Form.jsx`, `Preview.jsx`, and `ResumeWizard.jsx`.
- Removed unused imports and dead aliases introduced during hardening.
- Replaced the empty password-reset/account-response catch with explicit logging.
- Kept non-blocking legacy/style findings as warnings instead of release-blocking errors.

## Verify locally

Run from the project directory:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm ci
npm run lint
npm run build
```

`npm run lint` should exit with code 0. Some legacy warnings may remain, but they are intentionally non-blocking.
