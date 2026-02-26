import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import PatientDetailsView from './components/PatientDetailsView';
import BookingView from './components/BookingView';
import DashboardView from './components/DashboardView';
import QueryView from './components/QueryView';
import EmergencyAlert from './components/EmergencyAlert';
import BookingConfirmation from './components/BookingConfirmation';
import TriageHistory from './components/TriageHistory';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';

const STORAGE_APPOINTMENTS = 'pulse_ai_appointments';
const STORAGE_HISTORY = 'pulse_ai_triage_history';

function loadFromStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error(`Failed to save ${key} to localStorage`);
  }
}

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Core State
  const [appointments, setAppointments] = useState(() => loadFromStorage(STORAGE_APPOINTMENTS));
  const [triageHistory, setTriageHistory] = useState(() => loadFromStorage(STORAGE_HISTORY));
  const [triageResult, setTriageResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  // Booking State
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_APPOINTMENTS, appointments); }, [appointments]);
  useEffect(() => { saveToStorage(STORAGE_HISTORY, triageHistory); }, [triageHistory]);

  const handleTriage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setTriageResult(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      setTriageResult(result);

      // Save to triage history
      setTriageHistory(prev => [{
        symptoms: symptoms,
        department: result.department,
        urgency: result.urgency,
        summary: result.summary,
        recommendation: result.recommendation,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 50)); // Keep last 50

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
    setConfirmedAppointment(newAppointment);
    setCurrentView('confirmation');
    setTriageResult(null);
    setSymptoms('');
    setSelectedSlot(null);
    setPatientName('');
  };

  const handleClearHistory = () => {
    setTriageHistory([]);
    localStorage.removeItem(STORAGE_HISTORY);
  };

  const availableSlots = TIME_SLOTS.filter(s =>
    (!triageResult || s.department === triageResult.department) && s.available
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

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

        {currentView === 'patient-details' && <PatientDetailsView setCurrentView={setCurrentView} />}

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

        {currentView === 'confirmation' && confirmedAppointment && (
          <BookingConfirmation
            appointment={confirmedAppointment}
            onGoToDashboard={() => {
              setConfirmedAppointment(null);
              setCurrentView('dashboard');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            setCurrentView={setCurrentView}
            appointments={appointments}
          />
        )}

        {currentView === 'history' && (
          <TriageHistory
            history={triageHistory}
            onClearHistory={handleClearHistory}
            setCurrentView={setCurrentView}
          />
        )}
      </main>
    </div>
  );
}

export default App;
