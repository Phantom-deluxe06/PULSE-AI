# Design Document: PULSE AI

> **Patient Urgency Logic & Scheduling Engine**
> Version 1.0 | Hackathon Submission

---

## 1. System Overview

PULSE AI is an AI-powered patient triage and appointment management system. It replaces traditional static booking forms with an intelligent conversational interface that understands symptoms in natural language, classifies urgency, routes to the correct medical department, and allows instant booking.

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     PULSE AI Client                      │
│                   (React + Tailwind)                     │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │  Home View  │  │ Query View │  │  Booking View     │  │
│  │ (Landing)   │  │ (Triage)   │  │ (Scheduling)      │  │
│  └────────────┘  └─────┬──────┘  └────────┬──────────┘  │
│                        │                   │             │
│  ┌─────────────────────┴───────────────────┘             │
│  │         State Manager (React useState)                │
│  │         └── appointments[], currentView               │
│  └───────────────────────┬───────────────────────────┐   │
│                          │                           │   │
│  ┌───────────────────────┴────────┐  ┌───────────────┴─┐ │
│  │  Dashboard View                │  │  Triage History │ │
│  │  (Appointments + Status Tags)  │  │  (Past Queries) │ │
│  └────────────────────────────────┘  └─────────────────┘ │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS (API Call)
                           ▼
              ┌────────────────────────┐
              │   Google Gemini API    │
              │  gemini-2.5-flash      │
              │  (Structured Output)   │
              └────────────────────────┘
```

---

## 2. Core Component Design

### 2.1 AI Triage Engine

The triage engine is the **core innovation** of PULSE AI. It converts unstructured patient symptom text into a structured medical classification.

**Flow:**

```
Patient Input (free text)
        │
        ▼
┌───────────────────────┐
│  Gemini API Request   │
│  ─ System Prompt      │
│  ─ Symptom Text       │
│  ─ JSON Schema        │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Structured Response  │
│  {                    │
│    department,        │
│    urgency (1-5),     │
│    summary,           │
│    recommendation     │
│  }                    │
└───────────┬───────────┘
            │
    ┌───────┴────────┐
    ▼                ▼
Auto-route       Show Triage
to Booking       Summary Card
```

**Resilience Strategy — Exponential Backoff:**

| Retry | Delay | Total Elapsed |
|-------|-------|---------------|
| 1 | 1s | 1s |
| 2 | 2s | 3s |
| 3 | 4s | 7s |
| 4 | 8s | 15s |
| 5 | 16s | 31s |

After 5 failures, display a graceful error with a "Try Again" option.

### 2.2 Booking System

The booking system presents available time slots filtered by the AI-recommended department.

**Slot Management:**

- Pre-defined mock `TIME_SLOTS` array simulating real availability.
- Each slot contains: `{ id, time, department, available: boolean }`.
- Booked slots are marked `available: false` to prevent double-booking.

**Urgency Integration:**

| Urgency Level | Label | Visual | Behavior |
|---|---|---|---|
| 1–2 | Routine | Default styling | Standard slot selection |
| 3 | Moderate | Yellow badge | Advisory note shown |
| 4–5 | Priority / Emergency | Red badge, highlighted | "Priority" flag on booking summary |

### 2.3 Patient Dashboard

A single-view record of all patient interactions:

| Element | Data Source | Display |
|---|---|---|
| Appointment Cards | `appointments[]` state | Card list with department, date, status |
| Status Badges | Booking confirmation | Green (Confirmed), Yellow (Pending) |
| Urgency Tags | Triage engine output | Color-coded: Green (1-2), Yellow (3), Red (4-5) |
| Triage History | Stored query results | Expandable accordion with summary + recommendation |

---

## 3. Data Models

### 3.1 Triage Result

```typescript
interface TriageResult {
  department: "General Medicine" | "Cardiology" | "Neurology" | "Pediatrics" | "Orthopedics";
  urgency: 1 | 2 | 3 | 4 | 5;
  summary: string;
  recommendation: string;
}
```

### 3.2 Appointment

```typescript
interface Appointment {
  id: string;
  patientName: string;
  department: string;
  date: string;
  time: string;
  urgency: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  triageSummary: string;
  recommendation: string;
  createdAt: string;
}
```

### 3.3 Time Slot

```typescript
interface TimeSlot {
  id: string;
  time: string;
  department: string;
  available: boolean;
}
```

---

## 4. UI/UX Design System

### 4.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#2563eb` | CTA buttons, active states, links |
| `primary-light` | `#dbeafe` | Card backgrounds, hover highlights |
| `slate` | `#64748b` | Body text, secondary elements |
| `slate-dark` | `#1e293b` | Headings, primary text |
| `success` | `#16a34a` | Confirmed badges, positive feedback |
| `warning` | `#eab308` | Moderate urgency badges |
| `danger` | `#dc2626` | High urgency, error states |
| `white` | `#ffffff` | Backgrounds, card surfaces |

### 4.2 Typography

| Element | Style |
|---|---|
| Headings | `font-bold`, system sans-serif stack |
| Body | `text-slate-600`, `leading-relaxed` |
| Labels | `text-sm`, `font-medium`, `text-slate-500` |
| Badges | `text-xs`, `font-semibold`, uppercase |

### 4.3 Component Geometry

| Element | Border Radius | Shadow |
|---|---|---|
| Cards | `rounded-3xl` | `shadow-lg` to `shadow-xl` |
| Buttons | `rounded-2xl` | `shadow-md` on hover |
| Badges | `rounded-full` | None |
| Input Fields | `rounded-xl` | `shadow-sm` on focus |

### 4.4 Iconography (lucide-react)

| Context | Icons |
|---|---|
| Navigation | `Home`, `Search`, `Calendar`, `LayoutDashboard` |
| Medical | `Heart`, `Brain`, `Bone`, `Baby`, `Stethoscope` |
| Status | `CheckCircle`, `AlertTriangle`, `Clock`, `Loader2` |
| Actions | `Send`, `ArrowRight`, `ChevronDown` |

---

## 5. View Navigation Map

```
┌──────┐     ┌───────┐     ┌─────────┐     ┌───────────┐
│ Home │────▶│ Query │────▶│ Booking │────▶│ Dashboard │
└──────┘     └───────┘     └─────────┘     └───────────┘
   ▲             │              │                │
   └─────────────┴──────────────┴────────────────┘
                    (Back navigation)
```

**State Machine:**

| Current View | Action | Next View |
|---|---|---|
| `home` | Click "Start Triage" | `query` |
| `query` | Triage complete → "Book Now" | `booking` |
| `booking` | Appointment confirmed | `dashboard` |
| `dashboard` | Click "New Query" | `query` |
| Any view | Click "Home" in nav | `home` |

---

## 6. API Integration Design

### 6.1 Gemini API Request

```javascript
const requestBody = {
  contents: [{
    parts: [{
      text: `You are a medical triage AI. Analyze the following symptoms 
             and respond in JSON format with: department, urgency, 
             summary, recommendation.\n\nSymptoms: ${patientInput}`
    }]
  }],
  generationConfig: {
    temperature: 0.3,    // Low creativity for medical accuracy
    topP: 0.8,
    maxOutputTokens: 256
  }
};
```

### 6.2 Response Parsing

```javascript
// Extract JSON from Gemini's response text
const responseText = data.candidates[0].content.parts[0].text;
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
const triageResult = JSON.parse(jsonMatch[0]);
```

### 6.3 Error Boundary

| Error | User-Facing Message | Recovery |
|---|---|---|
| Network failure | "Connection issue. Retrying..." | Exponential backoff (auto) |
| API rate limit | "System is busy. Please wait." | Auto-retry with delay |
| Invalid JSON response | "Analysis incomplete. Please try again." | Re-prompt with retry button |
| API key missing | "System configuration error." | Admin alert (console.error) |

---

## 7. Accessibility Considerations

| Feature | Implementation |
|---|---|
| Keyboard Navigation | All interactive elements focusable, logical tab order |
| Screen Reader | `aria-label` on icons and status badges |
| Color Contrast | WCAG AA compliant — all text passes 4.5:1 ratio |
| Loading States | `aria-live="polite"` for triage results and booking confirmations |
| Text Input | Large textarea with placeholder guidance |

---

## 8. Security & Privacy (Current Scope)

| Concern | Mitigation |
|---|---|
| API Key Exposure | Key stored as environment variable, never in client bundle for production |
| Symptom Data | No server-side persistence in MVP — data lives in client state only |
| HTTPS | All API calls over HTTPS (Gemini API enforces TLS) |
| Input Sanitization | User input sanitized before display (React default XSS prevention) |

> **Future:** Phase 4 will add HIPAA-compliant encryption and audit logging.
