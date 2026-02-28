# PULSE AI — Patient Urgency Logic & Scheduling Engine

**PULSE AI** is an intelligent, AI-driven patient triage and appointment management system designed to reduce "friction-to-care." Instead of static forms, it uses a conversational AI interface (powered by Google Gemini) to understand patient symptoms in natural language, assess medical urgency, route patients to the correct specialist, and facilitate instant bookings.

## 🚀 Features

- **AI Triage Engine:** Analyzes raw symptom text and outputs a structured medical classification.
- **Auto-Routing:** Recommends the correct medical department based on symptom analysis.
- **Urgency Assessment:** Flags conditions from Priority 1 (Routine) to Priority 5 (Emergency) with color-coded badges.
- **Intelligent Booking:** Offers available time slots and prevents double-booking.
- **Patient Dashboard:** Tracks upcoming appointments, triage history, and health tips.
- **Virtual Assistant ChatBot:** A floating, friendly AI assistant ready to answer general health queries.

## 🛠 Tech Stack

- **Frontend Framework:** React + Vite (Single-page `.jsx` architecture)
- **Styling:** Tailwind CSS + Lucide React for iconography
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
- **Routing:** Browser API (History State / Hash Routing)

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Phantom-deluxe06/PULSE-AI.git
   cd PULSE-AI/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `frontend` directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment Guide (Render)

Deploying the PULSE AI Frontend on [Render](https://render.com/) is straightforward.

### Setting up a Static Web Service

1. **Sign in to Render** using your GitHub account.
2. Click the **"New"** button in the dashboard and select **"Static Site"**.
3. **Connect your Repository:**
   - Search for `PULSE-AI` and click **Connect** next to the `Phantom-deluxe06/PULSE-AI` repository.

### Configuration

4. Configure your site with the following settings:
   - **Name:** `pulse-ai-frontend` (or any name you prefer)
   - **Branch:** `main` (or `dev`)
   - **Root Directory:** `frontend` *(Important: Since the React app is inside the `frontend` folder)*
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

### Environment Variables

5. Scroll down to the **Advanced** section.
6. Click **Add Environment Variable**.
7. Add your Gemini API key:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** *[paste your Gemini API key here]*

### Deploy

8. Click **Create Static Site**.
9. Render will clone your repo, run the build command, and publish the `dist` folder.
10. Once the build finishes, your site will be live on a `.onrender.com` URL!

---

*Note: For the hackathon MVP, the backend is simulated via `localStorage`. The provided `backend` folder contains the Supabase SQL schema for post-hackathon scaling.*
