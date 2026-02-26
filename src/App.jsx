import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import BookingView from './components/BookingView';
import DashboardView from './components/DashboardView';
import QueryView from './components/QueryView';
import EmergencyAlert from './components/EmergencyAlert';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';

const STORAGE_KEY = 'pulse_ai_appointments';

function loadAppointments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveAppointments(appointments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    console.error('Failed to save appointments to localStorage');
  }
}

function App() {
  // View State
  const [currentView, setCurrentView] = useState('home');

  // Person A: Core Logic State
  const [appointments, setAppointments] = useState(loadAppointments);
  const [triageResult, setTriageResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);

  // Booking State
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');

  // Persist appointments to localStorage whenever they change
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const handleTriage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setTriageResult(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      setTriageResult(result);
      // Show Emergency Alert only for Level 5 urgency
      if (result.urgency === 5) {
        setShowEmergency(true);
      }
    } catch (err) {
      setError(err.message || "An error occurred during triage. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = () => {
    if (!selectedSlot || !patientName.trim()) return;

    const newAppointment = {
      id: Date.now().toString(),
      patientName,
      department: triageResult?.department || 'General Medicine',
      date: new Date().toLocaleDateString(),
      time: selectedSlot.time,
      urgency: triageResult?.urgency || 1,
      status: "Confirmed",
      triageSummary: triageResult?.summary || '',
      recommendation: triageResult?.recommendation || '',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    setCurrentView('dashboard');
    setTriageResult(null);
    setSymptoms('');
    setSelectedSlot(null);
    setPatientName('');
  };

  const availableSlots = TIME_SLOTS.filter(s =>
    (!triageResult || s.department === triageResult.department) && s.available
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Emergency Level 5 Modal */}
      {showEmergency && triageResult && (
        <EmergencyAlert
          triageResult={triageResult}
          onProceedToBooking={() => {
            setShowEmergency(false);
            setCurrentView('booking');
          }}
          onDismiss={() => {
            setShowEmergency(false);
            setTriageResult(null);
            setSymptoms('');
          }}
        />
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}

        {currentView === 'query' && (
          <QueryView
            setCurrentView={setCurrentView}
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            isLoading={isLoading}
            error={error}
            triageResult={triageResult}
            setTriageResult={setTriageResult}
            handleTriage={handleTriage}
          />
        )}

        {currentView === 'booking' && (
          <BookingView
            setCurrentView={setCurrentView}
            triageResult={triageResult}
            patientName={patientName}
            setPatientName={setPatientName}
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            handleBookSlot={handleBookSlot}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            setCurrentView={setCurrentView}
            appointments={appointments}
          />
        )}
      </main>
    </div>
  );
}

export default App;
