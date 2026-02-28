# PPT Generation Prompt for PULSE AI

> **Copy-paste the prompt below into any AI presentation tool (Gamma, SlidesGPT, ChatGPT, Google Gemini, etc.) to generate your hackathon pitch deck.**

---

## 📋 Prompt

```
Create a professional, modern, visually striking hackathon pitch deck (12-15 slides) for a project called "PULSE AI — Patient Urgency Logic & Scheduling Engine."

Use a clean healthcare-inspired design with a dark navy/slate background, soft blue (#2563eb) as the primary accent, white text, and green/amber/red for urgency indicators. Use modern sans-serif typography. Include relevant medical/tech icons or illustrations in each slide.

### Slide-by-Slide Content:

**Slide 1 — Title Slide**
- Title: "PULSE AI"
- Subtitle: "Patient Urgency Logic & Scheduling Engine"
- Tagline: "AI-Driven Triage. Smarter Scheduling. Faster Care."
- Add a sleek medical AI visual (brain + heartbeat graphic)

**Slide 2 — The Problem**
- Heading: "The Friction-to-Care Problem"
- Bullet points:
  • Patients don't know which department to visit
  • Manual triage is slow, subjective, and inconsistent
  • Static booking forms have no intelligence about patient urgency
  • No centralized patient interaction history — symptoms are repeated every visit
- Use a visual showing a frustrated patient or long hospital queue

**Slide 3 — Our Solution**
- Heading: "PULSE AI — Intelligent Healthcare at Your Fingertips"
- Bullet points:
  • AI understands symptoms in plain language
  • Classifies urgency from P1 (Routine) to P5 (Emergency)
  • Auto-routes to the correct specialist department
  • Enables instant appointment booking with conflict prevention
  • Provides a unified patient dashboard with full history
- Use a visual showing a clean, modern app interface

**Slide 4 — How It Works (User Flow)**
- Heading: "From Symptom to Specialist in 60 Seconds"
- Show a horizontal flow diagram:
  Step 1: Patient enters symptoms in natural language →
  Step 2: Gemini AI analyzes & classifies →
  Step 3: Auto-routes to correct department →
  Step 4: Patient books available slot →
  Step 5: Appointment confirmed on dashboard

**Slide 5 — AI Triage Engine (Core Innovation)**
- Heading: "The Brain Behind PULSE"
- Explain: Powered by Google Gemini 2.5 Flash
- Show the JSON output schema:
  • Department (e.g., Cardiology)
  • Urgency (1-5 scale)
  • Summary (1-sentence diagnosis)
  • Recommendation (patient advice)
  • Tips (wellness suggestions)
- Add: Exponential backoff retry logic for reliability (3 retries)
- Visual: AI brain processing symptoms into structured data

**Slide 6 — Key Features Overview**
- Heading: "Feature Highlights"
- Grid layout with icons:
  • 🧠 AI Triage Engine — Symptom-to-specialist in seconds
  • 📅 Smart Booking — Auto-filtered slots, no double-booking
  • 📊 Patient Dashboard — Appointments, history, health tips
  • 💬 AI ChatBot — 24/7 virtual health assistant
  • 🚨 Emergency Alerts — Instant P5 urgency notifications
  • 👨‍⚕️ Admin Dashboard — Doctor portal for patient management

**Slide 7 — AI ChatBot**
- Heading: "Your Virtual Health Assistant"
- Explain: Floating chat widget on every page
- Powered by Gemini AI with healthcare persona
- Features: Suggestion chips, conversation memory, safety guardrails
- Refuses diagnoses, recommends real doctors for serious symptoms
- Visual: Screenshot-style mockup of the chatbot UI

**Slide 8 — Tech Stack**
- Heading: "Built with Modern Technology"
- Visual tech stack diagram:
  • Frontend: React 19 + Vite 7
  • Styling: Tailwind CSS 4
  • AI: Google Gemini API (gemini-2.5-flash)
  • Auth: Supabase Authentication
  • Database: Supabase PostgreSQL with Row Level Security
  • Icons: Lucide React

**Slide 9 — Architecture Diagram**
- Heading: "System Architecture"
- Show a clean architecture diagram:
  • Client Layer: React SPA (Home, Triage, Booking, Dashboard, ChatBot)
  • State Layer: React useState + localStorage
  • API Layer: HTTPS calls to Gemini AI
  • Auth Layer: Supabase Auth
  • Data Layer: Supabase PostgreSQL

**Slide 10 — Security & Privacy**
- Heading: "Patient Data Security"
- Bullet points:
  • API keys stored in environment variables, never in source code
  • Supabase Row Level Security — users only see their own data
  • React auto-escaping prevents XSS attacks
  • All API calls over HTTPS/TLS
  • No sensitive data in localStorage
  • Future: HIPAA-compliant encryption planned

**Slide 11 — Demo / Screenshots**
- Heading: "See PULSE AI in Action"
- Show 3-4 key screenshots or mockups:
  1. Home page hero section
  2. AI Triage result card with urgency badge
  3. Patient dashboard with appointments
  4. Floating AI ChatBot in action

**Slide 12 — Impact & Metrics**
- Heading: "Why PULSE AI Matters"
- Key metrics (projected):
  • 70% reduction in triage wait time
  • 90% accurate department routing
  • 60-second symptom-to-specialist flow
  • Zero double-bookings with smart slot management
- Visual: Impact statistics with bold numbers

**Slide 13 — Future Roadmap**
- Heading: "What's Next"
- Timeline or roadmap visual:
  • Phase 2: Voice Input (Web Speech API) — hands-free symptom entry
  • Phase 3: Blockchain Audit Trail (Solidity) — immutable triage records
  • Phase 4: HIPAA Security — end-to-end encryption
  • Phase 5: Multi-language Support — global accessibility

**Slide 14 — Team**
- Heading: "Meet the Team"
- Two team members:
  • Person A — AI & Logic Lead (Triage engine, API, state management)
  • Person B — UI & Experience Lead (Views, design, animations, ChatBot)
- Add placeholder profile pictures and role descriptions

**Slide 15 — Thank You / Q&A**
- Title: "Thank You!"
- Subtitle: "PULSE AI — Smarter Healthcare, One Symptom at a Time"
- Include GitHub link: github.com/Phantom-deluxe06/PULSE-AI
- "Questions?" text at the bottom

### Design Guidelines:
- Use a dark navy (#0f172a) or very dark slate background
- Primary blue accent: #2563eb
- Success green: #16a34a, Warning amber: #eab308, Danger red: #dc2626
- Rounded cards and modern UI elements
- Clean, minimal layout with plenty of white space
- Use gradients sparingly for emphasis
- Keep text concise — bullet points, not paragraphs
- Every slide should have a relevant visual, icon, or diagram
```

---

> **Recommended Tools:** [Gamma.app](https://gamma.app), [SlidesGPT](https://slidesgpt.com), [Beautiful.ai](https://beautiful.ai), or paste into ChatGPT/Gemini and ask it to generate slide content.
