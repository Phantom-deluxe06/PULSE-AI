import { useState } from 'react'
import { analyzeSymptoms } from './api'
import { TIME_SLOTS } from './constants'
import { Loader2, Heart, Brain, Bone, Baby, Stethoscope, AlertTriangle, Calendar, CheckCircle } from 'lucide-react'

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

  // Person A State
  const [symptoms, setSymptoms] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Booking State
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [patientName, setPatientName] = useState('')

  // Icon Mapper
  const getDeptIcon = (dept) => {
    switch (dept) {
      case 'Cardiology': return <Heart className="w-5 h-5 text-red-500" />
      case 'Neurology': return <Brain className="w-5 h-5 text-purple-500" />
      case 'Orthopedics': return <Bone className="w-5 h-5 text-amber-500" />
      case 'Pediatrics': return <Baby className="w-5 h-5 text-blue-500" />
      default: return <Stethoscope className="w-5 h-5 text-teal-500" />
    }
  }

  // Color mapper based on urgency
  const getUrgencyColor = (urgency) => {
    if (urgency <= 2) return 'bg-success text-white'
    if (urgency === 3) return 'bg-warning text-slate-dark'
    return 'bg-danger text-white'
  }

  const handleTriage = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await analyzeSymptoms(symptomText)
      setTriageResult(result)
    } catch (err) {
      setError(err.message || "An error occurred during triage. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSlot = () => {
    if (!selectedSlot || !patientName.trim()) return

    const newAppointment = {
      id: Date.now().toString(),
      patientName,
      department: triageResult.department,
      date: new Date().toLocaleDateString(), // Mocking today
      time: selectedSlot.time,
      urgency: triageResult.urgency,
      status: "Confirmed",
      triageSummary: triageResult.summary,
      recommendation: triageResult.recommendation,
      createdAt: new Date().toISOString()
    }

    setAppointments(prev => [...prev, newAppointment])
    setCurrentView(VIEWS.DASHBOARD)

    // Reset state
    setTriageResult(null)
    setSymptoms('')
    setSelectedSlot(null)
    setPatientName('')
  }

  // Filter slots for current department
  const availableSlots = TIME_SLOTS.filter(s =>
    (!triageResult || s.department === triageResult.department) && s.available
  )

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden min-h-[80vh] flex flex-col">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-dark cursor-pointer flex items-center gap-2" onClick={() => setCurrentView(VIEWS.HOME)}>
            <Heart className="w-6 h-6 text-primary" />
            PULSE AI
          </h1>
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
        <main className="flex-1 p-6 flex flex-col items-center justify-center w-full">

          {currentView === VIEWS.HOME && (
            <div className="space-y-6 text-center">
              <h2 className="text-4xl font-bold text-slate-dark">Intelligent Patient Triage</h2>
              <p className="text-slate-600 max-w-md mx-auto text-lg">
                Describe your symptoms in plain language, and our AI will assess the urgency and recommend the right specialist.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setCurrentView(VIEWS.QUERY)}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                  Start Triage <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentView === VIEWS.QUERY && (
            <div className="w-full max-w-2xl flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-slate-dark text-center mb-2">How are you feeling today?</h2>

              {!triageResult ? (
                <form onSubmit={handleTriage} className="flex flex-col gap-4">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="E.g., I've had a sharp pain in my chest since this morning and my left arm feels numb..."
                    className="w-full h-40 p-4 border border-slate-200 text-slate-dark rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  />

                  {error && (
                    <div className="bg-red-50 text-danger p-3 rounded-xl text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !symptoms.trim()}
                    className="bg-primary text-white p-4 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Symptoms...</>
                    ) : 'Assess My Symptoms'}
                  </button>
                </form>
              ) : (
                <div className="bg-primary-light/30 border border-primary-light p-6 rounded-3xl flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                      {getDeptIcon(triageResult.department)}
                      <span className="font-semibold text-slate-dark text-sm">{triageResult.department}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyColor(triageResult.urgency)}`}>
                      Urgency: Level {triageResult.urgency}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-dark text-lg mb-1">AI Assessment</h3>
                    <p className="text-slate-600">{triageResult.summary}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h3 className="font-semibold text-slate-dark text-sm mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" /> Recommendation
                    </h3>
                    <p className="text-slate-600 text-sm">{triageResult.recommendation}</p>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setTriageResult(null)}
                      className="flex-1 bg-white text-slate-600 border border-slate-200 p-3 rounded-xl font-medium hover:bg-slate-50 transition"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setCurrentView(VIEWS.BOOKING)}
                      className="flex-1 bg-primary text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === VIEWS.BOOKING && (
            <div className="w-full max-w-2xl flex flex-col gap-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-slate-dark">Schedule Appointment</h2>
                {triageResult && (
                  <p className="text-slate-500 mt-2">
                    Auto-filtered for <span className="font-semibold text-primary">{triageResult.department}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {availableSlots.length > 0 ? availableSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${selectedSlot?.id === slot.id
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-primary'
                        }`}
                    >
                      <Calendar className="w-4 h-4" /> {slot.time}
                    </button>
                  )) : (
                    <div className="col-span-full text-center p-6 bg-slate-50 rounded-xl text-slate-500">
                      No available slots for this department today.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBookSlot}
                  disabled={!selectedSlot || !patientName.trim()}
                  className="mt-6 bg-success text-white p-4 rounded-2xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {currentView === VIEWS.DASHBOARD && (
            <div className="w-full max-w-3xl flex flex-col gap-6">
              <div className="flex justify-between items-end mb-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-dark">Patient Dashboard</h2>
                  <p className="text-slate-500">Manage your appointments and history.</p>
                </div>
                <button
                  onClick={() => setCurrentView(VIEWS.QUERY)}
                  className="bg-primary-light text-primary px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-200 transition"
                >
                  + New Query
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center p-12 bg-slate-50 border border-slate-100 rounded-3xl">
                  <p className="text-slate-500">No appointments scheduled yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {appointments.map(apt => (
                    <div key={apt.id} className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-slate-dark">{apt.patientName}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                            {apt.status}
                          </span>
                          {apt.urgency > 3 && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                              Priority
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            {getDeptIcon(apt.department)} {apt.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {apt.date} at {apt.time}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm max-w-xs">
                        <strong className="text-slate-dark block mb-1">Triage Notes:</strong>
                        <span className="text-slate-600 line-clamp-2">{apt.triageSummary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default App
