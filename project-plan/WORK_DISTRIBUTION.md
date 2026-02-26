# Work Distribution: PULSE AI

> **2-Person Team Split** | Hackathon Build

---

## Team Roles

| Role | Owner | Focus Areas |
|---|---|---|
| **Person A — AI & Logic Lead** | _[Name]_ | Triage Engine, API Integration, State Management, Data Logic |
| **Person B — UI & Experience Lead** | _[Name]_ | All Views (Home, Booking, Dashboard), Styling, Animations, Responsiveness |

---

## Phase 1: Project Setup (Day 1 — Together)

> **Both team members** do this together to align on the codebase.

| # | Task | Owner | Time |
|---|---|---|---|
| 1.1 | Initialize Vite + React project (`npx create-vite@latest ./ --template react`) | Both | 10 min |
| 1.2 | Install dependencies (`tailwindcss`, `lucide-react`, `postcss`, `autoprefixer`) | Both | 10 min |
| 1.3 | Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`) | Both | 10 min |
| 1.4 | Create `.env` with `VITE_GEMINI_API_KEY` and add `.env` to `.gitignore` | Both | 5 min |
| 1.5 | Create base `App.jsx` with view state (`home`, `query`, `booking`, `dashboard`) | Both | 15 min |
| 1.6 | Create `dev` branch, push initial commit | Both | 5 min |

---

## Phase 2: Core Development (Day 1–2 — Parallel Work)

### 🧠 Person A — AI & Logic Lead

> **Branch:** `feature/triage-engine`

| # | Task | Priority | Est. Time |
|---|---|---|---|
| A1 | Build the **Gemini API integration** function with exponential backoff (5 retries) | P0 | 2 hrs |
| A2 | Implement **prompt engineering** — system role, JSON schema enforcement, one-shot classification | P0 | 1 hr |
| A3 | Build **response validation** function (`validateTriageResult`) | P0 | 30 min |
| A4 | Create the **Query View** — symptom input textarea + submit button + loading spinner | P0 | 1.5 hrs |
| A5 | Build **Triage Result Card** — display department, urgency badge, summary, recommendation | P0 | 1 hr |
| A6 | Implement **mock TIME_SLOTS** data and **slot booking logic** (conflict prevention) | P1 | 1 hr |
| A7 | Wire up **auto-department filtering** — triage result → booking view pre-selects department | P1 | 30 min |
| A8 | Build **appointments state** management — add, list, status tracking | P1 | 1 hr |

**Person A Deliverables:**
- Working AI triage (input symptoms → get JSON result)
- Query View with loading states and error handling
- Booking logic (slot management, conflict prevention)
- Appointments state array with add/list operations

---

### 🎨 Person B — UI & Experience Lead

> **Branch:** `feature/ui-views`

| # | Task | Priority | Est. Time |
|---|---|---|---|
| B1 | Build the **Home View** — hero section, app title "PULSE AI", tagline, "Start Triage" CTA button | P0 | 1.5 hrs |
| B2 | Build the **Navigation Bar** — logo, view tabs (Home, Dashboard), active state highlighting | P0 | 1 hr |
| B3 | Build the **Booking View** — department display, date picker, time slot grid, confirm button | P0 | 2 hrs |
| B4 | Build the **Dashboard View** — appointment cards list, status badges (Confirmed/Pending), urgency tags (color-coded) | P0 | 2 hrs |
| B5 | Implement **urgency color coding** — Green (1-2), Yellow (3), Red (4-5) across all views | P1 | 30 min |
| B6 | Add **loading animations** — `Loader2` spinner, success checkmark animation | P1 | 30 min |
| B7 | Build **Triage History** section in Dashboard — expandable accordion with past query results | P1 | 1 hr |
| B8 | **Responsive design** — mobile-first, test at 375px, 768px, 1024px | P1 | 1 hr |

**Person B Deliverables:**
- Pixel-perfect Home, Booking, and Dashboard views
- Navigation with view switching
- Color-coded urgency and status badges
- Mobile-responsive layout
- Loading/success animations

---

## Phase 3: Integration & Merge (Day 2–3)

> **Both together** — merge branches and connect logic to UI.

| # | Task | Owner | Est. Time |
|---|---|---|---|
| 3.1 | Merge `feature/triage-engine` into `dev` | Person A | 15 min |
| 3.2 | Merge `feature/ui-views` into `dev`, resolve conflicts | Person B | 30 min |
| 3.3 | Connect AI triage output → Booking View (auto-filter department) | Both | 30 min |
| 3.4 | Connect Booking confirmation → Dashboard (add to appointments array) | Both | 30 min |
| 3.5 | End-to-end flow test: Symptoms → Triage → Book → Dashboard | Both | 30 min |
| 3.6 | Fix bugs and edge cases | Both | 1 hr |

---

## Phase 4: Polish & Deploy (Day 3)

| # | Task | Owner | Est. Time |
|---|---|---|---|
| 4.1 | Final UI polish — spacing, shadows, hover effects | Person B | 1 hr |
| 4.2 | Error edge cases — empty input, API failure, invalid response | Person A | 1 hr |
| 4.3 | Deploy to Vercel (`npx vercel --prod`) | Both | 15 min |
| 4.4 | Test deployed version on mobile + desktop | Both | 30 min |
| 4.5 | Merge `dev` → `main` | Both | 10 min |

---

## Git Workflow Summary

```
main  ← Final demo-ready code
└── dev  ← Integration branch
    ├── feature/triage-engine   ← Person A works here
    └── feature/ui-views        ← Person B works here
```

**Rules:**
1. **Never push directly to `main`** — always merge through `dev`
2. **Pull `dev` before merging** your feature branch
3. **Small, frequent commits** — easier to resolve conflicts
4. **Commit message format:** `feat: description` / `fix: description` / `style: description`

---

## Communication Checkpoints

| When | What | How |
|---|---|---|
| Start of each day | Sync on progress + blockers | Quick call / chat |
| After completing a P0 task | Push to branch + notify teammate | Git push + message |
| Before merging to `dev` | Code review (even a quick one) | PR or screen-share |
| After integration | E2E flow test together | Shared screen |

---

## Quick Reference: Who Owns What

```
┌─────────────────────────────────────────────┐
│                  PULSE AI                   │
│                                             │
│  ┌──────────── Person A ──────────────┐     │
│  │  Gemini API call                   │     │
│  │  Prompt engineering                │     │
│  │  Response validation               │     │
│  │  Query View (input + result card)  │     │
│  │  Booking logic (slots, conflicts)  │     │
│  │  Appointments state management     │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌──────────── Person B ──────────────┐     │
│  │  Home View (hero + CTA)            │     │
│  │  Navigation Bar                    │     │
│  │  Booking View (UI + calendar)      │     │
│  │  Dashboard View (cards + badges)   │     │
│  │  Triage History (accordion)        │     │
│  │  Animations & responsiveness       │     │
│  └────────────────────────────────────┘     │
│                                             │
│  ┌──────────── Together ──────────────┐     │
│  │  Project setup                     │     │
│  │  Integration & merge               │     │
│  │  E2E testing                       │     │
│  │  Deployment                        │     │
│  └────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```
