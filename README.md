# Interface Doctor AI — Phase 2

DebugMD's secure screenshot diagnosis SaaS. This phase adds drag-and-drop screenshot intake, server-side signature/size/dimension validation, real schema-validated OpenAI vision analysis, prioritized findings, and responsive interactive issue overlays. Demo analysis is always explicitly labeled and is never substituted for a failed real request.

## Run

1. Add `DATABASE_URL`, a long random `SESSION_SECRET`, and optionally `OPENAI_API_KEY` in the workspace **Secrets** panel (see `.env.example`). `OPENAI_VISION_MODEL` optionally overrides `gpt-4o-mini`. Never expose these as `NEXT_PUBLIC_` values.
2. `npm install`
3. `npm run dev`
4. Open the preview, create an account, and create/rename/reopen/delete projects.

The database migration is managed in `db/migrations/` by the platform migration tool. It creates users, projects, and private screenshot objects. Screenshots are served only through an authenticated, owner-filtered server route; raw database/storage credentials never reach the browser. Each owner query sets `app.user_id` in a transaction so PostgreSQL RLS is enforced in addition to server authentication.

> The requested preference mentioned Supabase Auth/Storage. The preview provides built-in PostgreSQL but no Supabase URL/service credentials. Phase 1 therefore uses equivalent server-side JWT cookie auth and private PostgreSQL binary object storage, while preserving an ownership-aware data model that can be adapted to Supabase.

## Security notes

Passwords use bcrypt (cost 12). Sessions are signed, httpOnly, SameSite=Lax cookies and secure over HTTPS. Login attempts are rate-limited per email/IP. SQL is parameterized. Images accept only PNG/JPEG, are checked by file signature and decoder, are limited to 10 MB and dimensions from 320×240 to 8000×8000. AI calls have a 45-second timeout and one bounded retry; Zod rejects malformed model output. Project data is always selected under the authenticated owner's RLS context.

## Tests and production check

- `npm test`
- `npm run build`

Tests cover core validation constraints. For production, use managed distributed rate limiting. Safe redesign, comparison, verification, and reports are intentionally reserved for later phases.
