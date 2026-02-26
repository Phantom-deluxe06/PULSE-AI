import { useState } from 'react'

const VIEWS = {
  HOME: 'home',
  QUERY: 'query',
  BOOKING: 'booking',
  DASHBOARD: 'dashboard'
}

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME)
  const [appointments, setAppointments] = useState([])
  const [triageResult, setTriageResult] = useState(null)

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden min-h-[80vh] flex flex-col">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-dark">PULSE AI</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView(VIEWS.HOME)}
              className={`text-sm font-medium ${currentView === VIEWS.HOME ? 'text-primary' : 'text-slate-500'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView(VIEWS.DASHBOARD)}
              className={`text-sm font-medium ${currentView === VIEWS.DASHBOARD ? 'text-primary' : 'text-slate-500'}`}
            >
              Dashboard
            </button>
          </div>
        </nav>

        {/* Dynamic View Content */}
        <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          {currentView === VIEWS.HOME && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-dark">Intelligent Patient Triage</h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Describe your symptoms in plain language, and our AI will assess the urgency and recommend the right specialist.
              </p>
              <button
                onClick={() => setCurrentView(VIEWS.QUERY)}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
              >
                Start Triage
              </button>
            </div>
          )}

          {currentView === VIEWS.QUERY && (
            <div className="text-slate-600">
              <p>Person A: Build the Query View here.</p>
            </div>
          )}

          {currentView === VIEWS.BOOKING && (
            <div className="text-slate-600">
              <p>Person B: Build the Booking View here.</p>
            </div>
          )}

          {currentView === VIEWS.DASHBOARD && (
            <div className="text-slate-600">
              <p>Person B: Build the Dashboard View here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
