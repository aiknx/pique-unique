# Agent Guidelines – Pique Unique

Scope
- Work only in `agent/*` branches. Each sprint = separate branch.
- PLAN-FIRST: always propose a plan (files to change, commands, risks, validation) before large edits.
- Do NOT change infra/CI/CD/dependencies without a dedicated PR.
- Admin + DB already exist and are the source of truth. Any schema/migration must be ADR'd and co-changed in admin UI in the same PR (but avoid for now).

Booking & Payments
- No online payments for now. Booking flow = request submission → status `pending` → admin confirms/cancels.
- Emails + ICS are allowed later via a dedicated PR. Use mocks in dev.

Commands (whitelist)
- npm/pnpm/yarn; next; prisma; eslint; prettier; typecheck; test; playwright; git
- No arbitrary shell scripts without plan.

Security
- Never commit secrets. Use `.env` (gitignored). Provide `.env.template`.
- Show `git diff` before committing. Prefer dry-run where possible.

Quality
- Lint/typecheck required. Tests for critical flows (booking/auth).
- Provide Lighthouse stats for public pages if you change markup (target ≥90).

Deliverables
- PR must include: plan, diffs, SEO/A11y/Perf metrics (if relevant), tests summary, risks, rollback notes.
