# Product Requirements Document: PULSE AI

> **Project Name:** PULSE AI (Patient Urgency Logic & Scheduling Engine)
> **Focus:** AI-Driven Patient Triage & Appointment Management
> **Status:** Version 1.1 — Hackathon Ready

---

## 1. Product Vision

PULSE AI aims to solve the **"friction-to-care"** problem in healthcare. Instead of a static booking form, it provides an intelligent triage interface that understands patient symptoms in plain language, assesses urgency, and routes them to the correct specialist **automatically**.

---

## 2. Target Audience

| Persona | Description |
|---|---|
| **Low-Acuity Patients** | Users seeking quick consultations for non-emergency symptoms. |
| **Medical Administrators** | Staff who benefit from pre-triaged patient data. |
| **Accessibility Users** | Patients who prefer voice or natural language over complex navigation. |

---

## 3. Functional Requirements

### 3.1 AI Triage Engine (Core Innovation)

- **Input:** The system must accept raw text input (symptoms) from the patient.
- **Logic:** Uses `gemini-2.5-flash-preview-09-2025` to analyze the symptom text.
- **Output Schema:**

| Field | Type | Description |
|---|---|---|
| `department` | `string` | One of: `General Medicine`, `Cardiology`, `Neurology`, `Pediatrics`, `Orthopedics` |
| `urgency` | `integer` | `1` (Routine) to `5` (Emergency) |
| `summary` | `string` | A 1-sentence summary of the suspected issue. |
| `recommendation` | `string` | Brief advice (e.g., "See a doctor within 24 hours"). |

### 3.2 Intelligent Booking System

- **Dynamic Filtering:** If AI identifies "Cardiology," the booking calendar auto-selects the Cardiology department.
- **Urgency Handling:** If `urgency > 3`, highlight the "Priority" status in the booking summary.
- **Conflict Prevention:** Implement a mock list of `TIME_SLOTS` to ensure no overlapping appointments.

### 3.3 Patient Dashboard

- **State Management:** Track a list of persistent appointments.
- **Visual Indicators:** Color-coded tags for status (e.g., "Confirmed" in green) and urgency (e.g., "High" in red).
- **History:** Allow users to view past queries and their assigned triage summaries.

---

## 4. Technical Requirements

### 4.1 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React (Single-file `.jsx` approach for rapid deployment) |
| **Styling** | Tailwind CSS (utility-first, responsive design) |
| **Icons** | `lucide-react` for medical and UI iconography |
| **AI API** | Google Gemini API (Vertex AI / Generative Language) |

### 4.2 Data & State Architecture

- **Global State:** View management (`home`, `query`, `booking`, `dashboard`).
- **Persistent State:** Local appointments array (upgradeable to Firestore).
- **Error Handling:** Exponential backoff for AI API calls (5 retries: `1s → 2s → 4s → 8s → 16s`).

---

## 5. UI/UX Design Principles

| Principle | Implementation |
|---|---|
| **Anxiety Reduction** | Palette: Soft Blue (`#2563eb`), Slate (`#64748b`), White |
| **Rounded Geometry** | `rounded-3xl` for cards, `rounded-2xl` for buttons |
| **Feedback Loops** | `Loader2` spinners during AI analysis, clear success animations |

---

## 6. Innovation & Future Roadmap

| Phase | Feature | Technology |
|---|---|---|
| **Phase 2** | Voice Input | Web Speech API for hands-free symptom entry |
| **Phase 3** | Blockchain Audit Trail | Solidity — log triage summary hash for immutable records |
| **Phase 4** | HIPAA Security | End-to-end encryption for symptom data storage |
