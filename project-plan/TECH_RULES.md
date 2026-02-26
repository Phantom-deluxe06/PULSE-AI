# Tech Rules: PULSE AI

> **Patient Urgency Logic & Scheduling Engine**
> Version 1.0 | Hackathon Submission

---

## 1. Project Structure Rules

### 1.1 Single-File Architecture (MVP)

```
PULSE-AI/
├── project-plan/
│   ├── PRD.md                  # Product Requirements Document
│   ├── DESIGN_DOCUMENT.md      # Technical Design & Architecture
│   └── TECH_RULES.md           # This file — development rules
├── src/
│   └── App.jsx                 # Single-file React application
├── public/
│   └── index.html              # Entry HTML
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── .env                        # API keys (NEVER committed)
```

> **Rule:** For the hackathon MVP, the entire app lives in a single `App.jsx`. This enables rapid deployment and easy demo. Modularization happens post-hackathon.

### 1.2 File Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `TriageCard.jsx` |
| Utilities | camelCase | `parseTriageResponse.js` |
| Constants | SCREAMING_SNAKE | `TIME_SLOTS`, `DEPARTMENTS` |
| Documentation | UPPER_SNAKE | `TECH_RULES.md`, `PRD.md` |

---

## 2. Code Standards

### 2.1 React Rules

| Rule | Requirement |
|---|---|
| State Management | `useState` only — no Redux, no Context for MVP |
| Side Effects | `useEffect` for API calls only |
| Component Style | Functional components with hooks exclusively |
| Props | Destructure in function signature |
| Keys | Use unique `id` fields, never array indices |
| Event Handlers | Prefix with `handle` (e.g., `handleSubmit`, `handleBookSlot`) |

### 2.2 JavaScript Standards

| Rule | Standard |
|---|---|
| ES Version | ES2020+ (async/await, optional chaining, nullish coalescing) |
| Variables | `const` by default, `let` only when re-assignment is needed, never `var` |
| Strings | Template literals for interpolation |
| Equality | Strict equality (`===`) only |
| Error Handling | `try/catch` around all async operations |
| Logging | `console.error` for errors only — no `console.log` in production |

### 2.3 Tailwind CSS Rules

| Rule | Requirement |
|---|---|
| Inline Only | All styles via Tailwind utility classes — no custom CSS files |
| Responsive | Mobile-first: `sm:`, `md:`, `lg:` breakpoints |
| Colors | Use only the defined palette tokens (see Design Document §4.1) |
| Spacing | Consistent scale: `p-4`, `p-6`, `p-8` — avoid arbitrary values |
| Dark Mode | Not required for MVP |

---

## 3. AI Integration Rules

### 3.1 Gemini API Contract

| Parameter | Value | Rationale |
|---|---|---|
| Model | `gemini-2.5-flash-preview-09-2025` | Latest fast model for real-time triage |
| Temperature | `0.3` | Low randomness for medical consistency |
| Top-P | `0.8` | Balanced diversity without hallucination |
| Max Tokens | `256` | Triage response is short — prevent runaway output |

### 3.2 Prompt Engineering Rules

```
1. System role MUST be "medical triage AI"
2. ALWAYS request JSON output explicitly in the prompt
3. ALWAYS specify the exact output schema (department, urgency, summary, recommendation)
4. NEVER allow the model to ask follow-up questions — one-shot classification only
5. Department MUST be one of the 5 predefined values — enforce in prompt
6. Urgency MUST be an integer 1–5 — enforce in prompt
```

### 3.3 Response Validation

```javascript
// MANDATORY: Validate every triage response before use
function validateTriageResult(result) {
  const validDepts = [
    "General Medicine", "Cardiology", "Neurology", 
    "Pediatrics", "Orthopedics"
  ];
  
  return (
    validDepts.includes(result.department) &&
    Number.isInteger(result.urgency) &&
    result.urgency >= 1 &&
    result.urgency <= 5 &&
    typeof result.summary === "string" &&
    typeof result.recommendation === "string"
  );
}
```

### 3.4 Error Handling — Exponential Backoff

```javascript
// MANDATORY: All API calls must use this retry pattern
async function callWithRetry(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, 8s, 16s
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
```

---

## 4. State Management Rules

### 4.1 View States

```javascript
// ONLY these views are allowed
const VIEWS = ["home", "query", "booking", "dashboard"];

// State shape
const [currentView, setCurrentView] = useState("home");
const [appointments, setAppointments] = useState([]);
const [triageResult, setTriageResult] = useState(null);
const [isLoading, setIsLoading] = useState(false);
```

### 4.2 Data Persistence

| Data | Storage | Lifecycle |
|---|---|---|
| Current View | React state | Session only |
| Triage Result | React state | Until navigation or new query |
| Appointments | React state (array) | Session only (MVP) |
| API Key | `.env` file | Build-time injection |

> **Rule:** No `localStorage`, no `sessionStorage`, no cookies for MVP. All data is ephemeral. Post-hackathon can upgrade to Firestore.

### 4.3 Immutable State Updates

```javascript
// ✅ CORRECT — spread to create new array
setAppointments(prev => [...prev, newAppointment]);

// ❌ WRONG — direct mutation
appointments.push(newAppointment);
```

---

## 5. Security Rules

### 5.1 Mandatory

| Rule | Implementation |
|---|---|
| API Key | Store in `.env` as `VITE_GEMINI_API_KEY` — never hardcode |
| `.gitignore` | `.env` must be in `.gitignore` — verify before every commit |
| Input Display | React's JSX auto-escapes — never use `dangerouslySetInnerHTML` |
| HTTPS | All API calls must use `https://` endpoints |
| Validation | Always validate AI response before rendering |

### 5.2 Forbidden

```
❌ Hardcoded API keys in source code
❌ console.log() of patient symptom data
❌ dangerouslySetInnerHTML with user input
❌ HTTP (non-TLS) API calls
❌ eval() or Function() constructors
❌ Storing sensitive data in localStorage
```

---

## 6. Git & Version Control Rules

### 6.1 Branch Strategy (Hackathon)

```
main          ← Production-ready demo
└── dev       ← Active development
    ├── feature/triage-engine
    ├── feature/booking-system
    └── feature/dashboard
```

### 6.2 Commit Message Format

```
<type>: <short description>

Types:
  feat     → New feature
  fix      → Bug fix
  docs     → Documentation
  style    → Formatting (no logic change)
  refactor → Code restructure
  test     → Adding tests
  chore    → Build/config changes

Examples:
  feat: add AI triage engine with Gemini integration
  fix: resolve urgency badge color mapping
  docs: add PRD and design document
```

### 6.3 `.gitignore` Essentials

```
node_modules/
.env
.env.local
dist/
.DS_Store
*.log
```

---

## 7. Testing Rules (Post-MVP)

### 7.1 Test Priorities

| Priority | Area | Type |
|---|---|---|
| P0 | Triage response validation | Unit test |
| P0 | Appointment creation logic | Unit test |
| P1 | View navigation flow | Integration test |
| P1 | Booking conflict prevention | Integration test |
| P2 | Full triage → booking flow | E2E test |

### 7.2 Test Commands

```bash
# Unit tests
npm test

# E2E tests (future)
npx playwright test
```

---

## 8. Performance Rules

| Metric | Target | Method |
|---|---|---|
| First Contentful Paint | < 1.5s | Minimal bundle, Tailwind purge |
| AI Response Time | < 5s (with retries < 31s) | Exponential backoff |
| Bundle Size | < 500KB (gzipped) | Single-file approach, tree-shaking |
| Lighthouse Score | > 90 (Performance) | Vite build optimization |

---

## 9. Deployment Rules (Hackathon Demo)

### 9.1 Quick Deploy Options

| Platform | Command | Notes |
|---|---|---|
| **Vercel** | `npx vercel --prod` | Recommended — zero-config for Vite |
| **Netlify** | `netlify deploy --prod` | Alternative |
| **GitHub Pages** | Via GitHub Actions | Free, but no env vars |

### 9.2 Environment Variables

```bash
# Vercel
vercel env add VITE_GEMINI_API_KEY

# Netlify
netlify env:set VITE_GEMINI_API_KEY <value>
```

### 9.3 Pre-Deploy Checklist

```
[ ] .env is in .gitignore
[ ] API key is set as platform env var
[ ] Build succeeds locally (npm run build)
[ ] All views navigate correctly
[ ] Triage engine returns valid JSON
[ ] Booking prevents double-booking
[ ] Dashboard displays appointments
[ ] Mobile responsive on 375px width
```
