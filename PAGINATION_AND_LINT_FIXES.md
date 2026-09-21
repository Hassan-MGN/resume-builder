# Pagination and lint fixes

This patch addresses the latest Windows lint output and the live-preview pagination defect.

## Pagination

- Two-column pagination now uses a closer estimate for the live main column width.
- Experience entries are now split into responsibility chunks even when the section starts in the remaining space on a page. Previously, the paginator could move the entire experience section to the next page and leave a large blank region.
- Split logic correctly targets `cursor + count` when earlier experience entries already fit on the same page. This prevents the paginator from repeatedly splitting the wrong continuation item and growing the cursor indefinitely.
- Paginated experience chunks retain the original source index for editing continuation bullets.
- Regression QA includes a deliberate experience-splitting scenario.

## Lint blockers fixed

- `no-control-regex` in `api/ai.js`.
- `no-useless-assignment` in `aiEnhancer.js`.
- `no-useless-assignment` in Template1/2/6 section renderers.
- Removed unused pagination constants/helpers introduced by the hardening pass.

## Verification

Dependency-independent regression QA passed for all 11 templates, including data-preservation, PDF mappings, AI/auth hardening, telemetry, SQL configuration, and the new pagination split scenario.

A fresh `npm ci` could not be completed in the sandbox because the npm registry package `zod-validation-error@4.0.2` was not available from the local cache. Run `npm ci`, then `npm run lint` and `npm run build` on Windows for final environment verification.
