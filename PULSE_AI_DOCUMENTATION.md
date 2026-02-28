# PULSE AI — Complete Project Documentation

> **Project Name:** PULSE AI (Patient Urgency Logic & Scheduling Engine)  
> **Version:** 1.1 — Hackathon Ready  
> **Team:** 2-Person Build  
> **Date:** February 2026

---

## 1. Executive Summary

PULSE AI solves the **"friction-to-care"** problem in healthcare. Traditional hospital booking systems use static forms that offer no intelligence about patient needs. PULSE AI replaces this with a conversational AI interface that:

1. Accepts patient symptoms in **plain language**
2. Uses **Google Gemini AI** to classify urgency and recommend a department
3. **Auto-routes** patients to the correct specialist
4. Enables **instant appointment booking** with conflict prevention
5. Provides a **patient dashboard** with appointment tracking and triage history

---

## 2. Problem Statement

| Problem | Impact |
|---|---|
| Patients don't know which department to visit | Wasted time, delayed treatment |
| Manual triage is slow and subjective | Inconsistent urgency classification |
| Static booking forms lack intelligence | No urgency-aware scheduling |
| No centralized patient interaction history | Repeated symptom explanations |

**PULSE AI addresses all four problems** through AI-driven triage, auto-routing, intelligent booking, and a unified patient dashboard.

---

## 3. Solution Architecture

### 3.1 High-Level Architecture

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
│                          │                               │
│  ┌───────────────────────┴────────┐                      │
│  │  AI ChatBot (Floating Widget)  │                      │
│  └────────────────────────────────┘                      │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS (API Call)
                           ▼
              ┌────────────────────────┐
              │   Google Gemini API    │
              │  gemini-2.5-flash      │
              │  (Structured Output)   │
              └────────────────────────┘
```

### 3.2 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite 7 | SPA with fast HMR |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Icons** | Lucide React | Medical & UI iconography |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash`) | Symptom analysis & chat |
| **Auth** | Supabase Auth | User login/signup |
| **Database** | Supabase (PostgreSQL) | Patient profiles, appointments, triage history |
| **State** | React `useState` + `localStorage` | Session & persistent state |

---

## 4. Core Features — Detailed Breakdown

### 4.1 AI Triage Engine (Core Innovation)

The triage engine converts **unstructured patient symptom text** into a **structured medical classification**.

**How it works:**

```
Patient types: "I have severe chest pain and shortness of breath"
                    │
                    ▼
         ┌─────────────────────┐
         │   Gemini AI Model   │
         │  gemini-2.5-flash   │
         └─────────┬───────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  Structured Output: │
         │  department:        │
         │    "Cardiology"     │
         │  urgency: 5         │
         │  summary: "Possible │
         │    cardiac event"   │
         │  recommendation:    │
         │    "Seek emergency  │
         │     care immediately│
         └─────────────────────┘
```

**Output Schema:**

| Field | Type | Description |
|---|---|---|
| `department` | `string` | One of: General Medicine, Cardiology, Neurology, Pediatrics, Orthopedics |
| `urgency` | `integer` | 1 (Routine) to 5 (Emergency) |
| `summary` | `string` | 1-sentence summary of suspected issue |
| `recommendation` | `string` | Brief patient advice |
| `tips` | `array` | 2-3 wellness tips related to symptoms |

**Resilience — Exponential Backoff:**

| Retry | Delay | Total Elapsed |
|---|---|---|
| 1 | 1s | 1s |
| 2 | 2s | 3s |
| 3 | 4s | 7s |

After 3 failures, a graceful error message is shown with a "Try Again" option.

### 4.2 Multi-Slide Patient Onboarding

A guided 3-step triage flow:

| Slide | Component | Purpose |
|---|---|---|
| Slide 1 | `PatientDetailsView` | Collect patient demographics (name, age, gender) |
| Slide 2 | `SlideTwoQuery` | Symptom description in natural language |
| Slide 3 | `SlideThreePrefs` | Preferences & confirmation before AI analysis |

### 4.3 Intelligent Booking System

- **Dynamic Filtering:** AI-recommended department auto-selects in booking
- **Urgency Handling:** Priority 4-5 patients get highlighted "Priority" status
- **Conflict Prevention:** Mock `TIME_SLOTS` array prevents double-booking
- **Find Doctor:** Browse doctors by department, hospital, and availability

### 4.4 Patient Dashboard

| Element | Data Source | Display |
|---|---|---|
| Stat Cards | Appointments + History | Upcoming count, triage count, health score |
| Quick Actions | Navigation | Start Triage, Find Doctor, Refill Rx |
| Health Tips | Rotating array | Daily wellness tips with auto-rotation |
| Appointment List | `appointments[]` | Cards with department, date, status, urgency badge |
| Triage History | `triageHistory[]` | Recent AI analysis results with timestamps |

### 4.5 AI ChatBot (Virtual Health Assistant)

A **floating chat widget** on the bottom-right of all authenticated pages:

- **Powered by:** Gemini `gemini-2.5-flash` with `system_instruction`
- **Persona:** Friendly, empathetic healthcare assistant ("Pulse AI")
- **Capabilities:** General health Q&A, wellness tips, symptom guidance
- **Safety:** Refuses diagnoses, recommends doctors for serious concerns, flags emergencies
- **UI Features:** Suggestion chips, typing indicators, conversation history

### 4.6 Additional Features

| Feature | Component | Description |
|---|---|---|
| **Emergency Alert** | `EmergencyAlert.jsx` | Full-screen alert for urgency level 5 |
| **Booking Confirmation** | `BookingConfirmation.jsx` | Receipt with appointment details |
| **Symptom Checker** | `SymptomCheckerView.jsx` | Standalone quick symptom analysis |
| **Pharmacy & Refills** | `PharmacyView.jsx` | Prescription management UI |
| **Medical Records** | `MedicalRecordsView.jsx` | Patient medical history view |
| **Profile Management** | `ProfileView.jsx` | Edit user profile details |
| **Admin Dashboard** | `AdminDashboardView.jsx` | Doctor/admin portal for managing patients |
| **Toast Notifications** | `Toast.jsx` | Success/error feedback system |
| **Bottom Navigation** | `BottomNav.jsx` | Mobile-friendly navigation bar |

---

## 5. Authentication & Security

| Feature | Implementation |
|---|---|
| **Auth Provider** | Supabase Auth (Email + Password) |
| **Session Management** | `supabase.auth.onAuthStateChange()` listens for login/logout |
| **Route Protection** | Unauthenticated users redirected to home |
| **Admin Access** | `admin@pulse.ai` email grants admin dashboard access |
| **API Key Security** | Stored in `.env` as `VITE_GEMINI_API_KEY`, never committed |
| **Input Safety** | React's JSX auto-escaping prevents XSS |
| **Row Level Security** | Supabase RLS ensures users only access their own data |

---

## 6. Database Schema (Supabase)

### Tables

| Table | Purpose | Key Fields |
|---|---|---|
| `patient_profiles` | User demographics | `id`, `first_name`, `last_name`, `phone`, `age`, `gender`, `role` |
| `appointments` | Booked appointments | `user_id`, `patient_name`, `department`, `appointment_date`, `urgency`, `status` |
| `triage_history` | Past AI analyses | `user_id`, `symptoms`, `department`, `urgency`, `summary` |

All tables have **Row Level Security (RLS)** enabled so patients can only see their own data.

---

## 7. Project Structure

```
PULSE-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomeView.jsx            # Landing page
│   │   │   ├── LoginView.jsx           # Login form
│   │   │   ├── SignupView.jsx          # Registration form
│   │   │   ├── PatientDetailsView.jsx  # Triage slide 1
│   │   │   ├── SlideTwoQuery.jsx       # Triage slide 2
│   │   │   ├── SlideThreePrefs.jsx     # Triage slide 3
│   │   │   ├── QueryView.jsx           # Symptom input + result
│   │   │   ├── BookingView.jsx         # Time slot booking
│   │   │   ├── BookingConfirmation.jsx # Confirmation receipt
│   │   │   ├── DashboardView.jsx       # Patient dashboard
│   │   │   ├── FindDoctorView.jsx      # Doctor search
│   │   │   ├── SymptomCheckerView.jsx  # Quick symptom check
│   │   │   ├── PharmacyView.jsx        # Pharmacy & refills
│   │   │   ├── MedicalRecordsView.jsx  # Medical records
│   │   │   ├── ProfileView.jsx         # User profile
│   │   │   ├── AdminDashboardView.jsx  # Admin portal
│   │   │   ├── ChatBot.jsx             # AI chat assistant
│   │   │   ├── Sidebar.jsx             # Desktop navigation
│   │   │   ├── BottomNav.jsx           # Mobile navigation
│   │   │   ├── EmergencyAlert.jsx      # P5 emergency modal
│   │   │   ├── Toast.jsx               # Notification system
│   │   │   └── TriageHistory.jsx       # History view
│   │   ├── utils/
│   │   │   ├── auth.js                 # Auth helper functions
│   │   │   ├── useToast.js             # Toast hook
│   │   │   └── useScrollReveal.js      # Scroll animation hook
│   │   ├── api.js                      # Gemini API integration
│   │   ├── constants.js                # TIME_SLOTS, departments
│   │   ├── supabase.js                 # Supabase client init
│   │   └── App.jsx                     # Root component
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── database_schema.sql             # Supabase table definitions
│   ├── admin_setup.sql                 # Admin RLS policies
│   ├── server.js                       # Placeholder backend
│   └── package.json
├── project-plan/
│   ├── PRD.md                          # Product Requirements
│   ├── DESIGN_DOCUMENT.md              # Technical Design
│   ├── TECH_RULES.md                   # Coding Standards
│   └── WORK_DISTRIBUTION.md            # Team task split
├── .env                                # API keys (gitignored)
├── .gitignore
└── README.md                           # Project overview + deploy guide
```

---

## 8. UI/UX Design Principles

| Principle | Implementation |
|---|---|
| **Anxiety Reduction** | Soft Blue palette, rounded geometry, calming gradients |
| **Mobile-First** | Responsive design with `BottomNav` for mobile, `Sidebar` for desktop |
| **Feedback Loops** | Loading spinners, typing indicators, toast notifications |
| **Color-Coded Urgency** | Green (P1-2), Yellow (P3), Red (P4-5) |
| **Accessibility** | Keyboard navigation, semantic HTML, readable typography |

---

## 9. Deployment

### Render (Static Site)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Environment Variable** | `VITE_GEMINI_API_KEY` = your API key |

---

## 10. Future Roadmap

| Phase | Feature | Technology |
|---|---|---|
| Phase 2 | Voice Input | Web Speech API |
| Phase 3 | Blockchain Audit Trail | Solidity — log triage summary hash |
| Phase 4 | HIPAA Security | End-to-end encryption |
| Phase 5 | Multi-language Support | i18n localization |

---

## 11. Team Contributions

| Role | Focus Areas |
|---|---|
| **Person A — AI & Logic Lead** | Gemini API integration, prompt engineering, response validation, booking logic, state management |
| **Person B — UI & Experience Lead** | Home/Booking/Dashboard views, navigation, animations, responsive design, ChatBot UI |

---

*Built with ❤️ for the hackathon — February 2026*
