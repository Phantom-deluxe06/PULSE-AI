import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
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

  const [appointments, setAppointments] = useState(() => loadFromStorage(STORAGE_APPOINTMENTS));
  const [triageHistory, setTriageHistory] = useState(() => loadFromStorage(STORAGE_HISTORY));
  const [triageResult, setTriageResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');

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

      setTriageHistory(prev => [{
        symptoms,
        department: result.department,
        urgency: result.urgency,
        summary: result.summary,
        recommendation: result.recommendation,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 50));

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

  // Show sidebar on non-home views
  const showSidebar = currentView !== 'home';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-200">

      {/* Sidebar — hidden on Home view */}
      {showSidebar && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}

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

      <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all ${showSidebar ? 'lg:ml-64' : ''}`}>
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}

        {currentView === 'patient-details' && <PatientDetailsView setCurrentView={setCurrentView} />}

        <div className={showSidebar ? 'px-4 sm:px-6 lg:px-8 py-4' : ''}>
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
        </div>
      </main>
    </div>
  );
}

export default App;
