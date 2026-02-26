# 🫀 PULSE AI

**Patient Urgency Logic & Scheduling Engine**

> An AI-powered patient triage and appointment management system that understands symptoms in plain language, assesses urgency, and routes patients to the correct specialist — automatically.

---

## 🚀 What is PULSE AI?

PULSE AI replaces static booking forms with an **intelligent triage interface**:

1. **Describe your symptoms** in plain language
2. **AI analyzes** and classifies urgency (1–5) + department
3. **Book instantly** with the right specialist
4. **Track everything** on your personal dashboard

---

## 🧠 Core Features

| Feature | Description |
|---|---|
| **AI Triage Engine** | Powered by Google Gemini — analyzes symptoms, classifies urgency, routes to department |
| **Smart Booking** | Auto-filters available slots by AI-recommended department |
| **Priority Detection** | Urgency > 3 triggers priority booking status |
| **Patient Dashboard** | Color-coded appointments, status badges, triage history |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Icons | lucide-react |
| AI | Google Gemini API (`gemini-2.5-flash-preview-09-2025`) |

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/Phantom-deluxe06/PULSE-AI.git
cd PULSE-AI

# Install dependencies
npm install

# Add your Gemini API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
PULSE-AI/
├── project-plan/
│   ├── PRD.md                  # Product Requirements
│   ├── DESIGN_DOCUMENT.md      # Technical Design
│   ├── TECH_RULES.md           # Development Rules
│   └── WORK_DISTRIBUTION.md    # Team Task Split
├── src/
│   └── App.jsx                 # Main Application
├── public/
├── .env                        # API Keys (not committed)
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

| Phase | Feature | Status |
|---|---|---|
| **v1.0** | AI Triage + Booking + Dashboard | 🔨 In Progress |
| **v2.0** | Voice Input (Web Speech API) | 📋 Planned |
| **v3.0** | Blockchain Audit Trail | 📋 Planned |
| **v4.0** | HIPAA-Compliant Encryption | 📋 Planned |

---

## 👥 Team

Built for hackathon shortlisting — demonstrating AI-driven innovation in healthcare.

---

## 📄 License

MIT
