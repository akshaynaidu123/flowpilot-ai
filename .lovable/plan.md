
# FlowPilot AI – Build Plan

A premium enterprise SaaS dashboard built on the existing TanStack Start + React + TS + Tailwind v4 + shadcn/ui template. All data and AI responses are mocked (no backend, no API keys). Framer Motion for animation, Recharts for analytics.

> Note on stack: The project ships on TanStack Start, not Vite + React Router DOM. Per your selection, I'll use TanStack's file-based router. Everything else (React, TS, Tailwind, shadcn, Framer Motion, Recharts, Vercel-deployable) matches the brief.

## Architecture

```
src/
  routes/
    __root.tsx                 (shell: providers, theme, toaster)
    index.tsx                  (redirects → /login or /dashboard)
    login.tsx                  (mock auth, demo credential chips)
    about.tsx                  ("About the Agent" page)
    _app.tsx                   (auth-gated layout: Sidebar + Topbar + <Outlet/>)
    _app.dashboard.tsx
    _app.command.tsx           (AI Command Center)
    _app.crm.tsx               (leads list + pipeline)
    _app.crm.$leadId.tsx       (lead detail + AI email draft)
    _app.hr.tsx                (candidates + kanban)
    _app.hr.onboarding.tsx     (checklist generator)
    _app.projects.tsx          (project list + kanban + risk)
    _app.projects.$projectId.tsx
    _app.finance.tsx           (invoices, aging, summary)
    _app.notifications.tsx
    _app.audit.tsx             (admin only)
    _app.settings.tsx
  components/
    layout/ (AppSidebar, Topbar, PageHeader, RoleBadge)
    dashboard/ (KpiCard, RevenueChart, ProjectStatusChart, ActivityFeed, InsightsPanel)
    ai/ (ChatWindow, MessageBubble, SuggestedPrompts, ReasoningPanel, SafetyNotice)
    crm/ (LeadTable, PipelineBoard, LeadScoreBadge, EmailDraftCard)
    hr/ (CandidateCard, HiringKanban, MatchScore, OnboardingChecklist, ResumeDropzone)
    projects/ (ProjectKanban, RiskBadge, WorkloadChart, MilestoneTracker)
    finance/ (InvoiceTable, AgingChart, FinanceSummary)
    common/ (EmptyState, LoadingSkeletons, GlassCard, GradientButton, Protected)
    ui/  (existing shadcn)
  lib/
    auth/  (mock-auth.ts — localStorage session, demo accounts, RBAC helpers)
    ai/    (provider.ts interface + mock-provider.ts streaming via async generators; stubs for openai/gemini/groq)
    data/  (seed-leads, seed-candidates, seed-employees, seed-projects, seed-tasks, seed-invoices, seed-notifications, seed-audit; deterministic via seeded faker-like utils)
    services/ (crm.ts, hr.ts, projects.ts, finance.ts, notifications.ts — pure functions over seed data + in-memory mutations)
    utils/ (format currency/date, scoring formulas, risk model)
  hooks/ (useAuth, useTheme, useStreamingChat, useDemoData)
  styles.css (extend tokens: brand gradient, glass surfaces, dark mode)
```

## Auth & RBAC (mock)

- `lib/auth/mock-auth.ts` stores `{userId, role}` in localStorage.
- Demo accounts seeded: admin / hr / sales / pm (+ employee).
- `_app.tsx` route uses `beforeLoad` to redirect to `/login` when not authenticated.
- Per-route role gates via a small `requireRole(roles[])` helper in `beforeLoad` (e.g. `/audit` admin-only, `/hr` admin+hr, etc.).
- `Protected` component hides UI controls by permission. `RoleBadge` shown in Topbar.
- All sensitive actions append to an in-memory audit log surfaced on `/audit`.

## AI Layer (mock, swappable)

- `AIProvider` interface: `chat(messages, opts) → AsyncIterable<Token>`, `score(lead)`, `draftEmail(lead)`, `screenResume(text)`, `analyzeProjectRisk(project)`, `summarize(kind)`.
- `MockProvider` implements all of the above with deterministic, realistic outputs and simulated token streaming (setInterval chunks). Includes a fake "reasoning" trace for the Reasoning Panel.
- Stub files for `openai-provider.ts`, `gemini-provider.ts`, `groq-provider.ts`, `qwen-provider.ts`, `deepseek-provider.ts` — each throws "configure API key" so swap is one line in `provider.ts`.

## Modules (mapped to brief)

1. **Dashboard** — KPI cards (Revenue, Open Leads, Active Projects, Employees, Tasks Due Today), Revenue area chart, Project status donut, Activity feed, AI Insights panel.
2. **AI Command Center** — Chat with streaming, suggested prompts grid, conversation history sidebar (localStorage), reasoning panel toggle, persistent safety banner.
3. **CRM Copilot** — Lead table w/ filters, drag-friendly pipeline board, lead detail with score breakdown, AI-suggested next action, email draft generator, sales analytics (funnel + trend).
4. **HR Assistant** — Drop-zone resume upload (mock parse), candidate cards w/ match score + extracted skills, hiring kanban, interview recommendation, onboarding checklist generator, HR analytics (pipeline, source mix, time-to-hire).
5. **Project Risk Agent** — Project list, Kanban board, workload bar chart per assignee, risk badges (Low/Med/High), milestone tracker, delayed alerts, AI mitigation suggestions, daily stand-up summary generator.
6. **Finance** — Invoice table with status, aging chart, payment reminder action, monthly snapshot KPIs, AI financial summary, bottleneck insights.
7. **Notifications** — Unified alert center; filter by type; mark-as-read.
8. **Audit Logs** — Admin-only table with actor/action/target/timestamp.
9. **Settings** — Theme toggle, AI provider selector (mock-only with disabled options), profile.
10. **About the Agent** — Architecture diagram (ASCII/SVG), tools list, security notes, human-review limitations.

## Showcase Workflows (explicit demos)

- **Lead → Score → Email**: open lead → "Score with AI" streams reasoning → "Draft follow-up" produces editable email.
- **Resume → Screen → Interview rec**: drop file → mock parse → match score + skills → "Recommend interview" produces suggested panel + questions.
- **Project delay → Risk → Mitigation**: open at-risk project → risk explanation → "Generate mitigation plan" outputs prioritized steps + standup blurb.

A homepage banner on `/dashboard` links directly to each workflow demo.

## Design

- Extend `src/styles.css` with brand tokens (indigo→violet gradient, glass surface vars, success/warn/danger), dark mode parity, elevation shadows.
- Sidebar via shadcn `sidebar` (collapsible icon mode), Topbar with search/notifications/role badge/theme toggle.
- Framer Motion: page fade/slide transitions, staggered KPI entry, chat bubble enter, kanban card hover.
- Empty states + skeletons across all lists.
- Mobile: sidebar becomes offcanvas, tables become stacked cards under `md`.

## Charts (Recharts)

- Revenue trend (Area), Lead funnel (custom Funnel-ish Bar), Hiring pipeline (Stacked Bar), Project completion (Donut), Employee distribution (Pie), Invoice aging (Bar).

## Deployment

- Static + SSR works on Vercel out of the box with TanStack Start's Vite output; no backend needed. README will include the Vercel deploy steps and note no env vars are required for the mock demo.

## Out of Scope (mock-only)

- No real persistence beyond localStorage (resets via Settings → "Reset demo data").
- No real email send, no real file parsing — resume parse uses filename + mock skill bank.
- No real auth — credentials match table only, no password hashing.

## Deliverable

A multi-page TanStack Start app with all 10 routes above, polished UI, working mock workflows, role gating, dark mode, animations, and Recharts analytics — ready to demo without any setup.
