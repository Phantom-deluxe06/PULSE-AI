import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import PatientDetailsView from './components/PatientDetailsView';
import SlideTwoQuery from './components/SlideTwoQuery';
import SlideThreePrefs from './components/SlideThreePrefs';
import BookingView from './components/BookingView';
import DashboardView from './components/DashboardView';
import FindDoctorView from './components/FindDoctorView';
import SymptomCheckerView from './components/SymptomCheckerView';
import PharmacyView from './components/PharmacyView';
import MedicalRecordsView from './components/MedicalRecordsView';
import QueryView from './components/QueryView';
import EmergencyAlert from './components/EmergencyAlert';
import BookingConfirmation from './components/BookingConfirmation';
import TriageHistory from './components/TriageHistory';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';
import { login as authLogin, signup as authSignup, logout as authLogout, getCurrentUser } from './utils/auth';

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
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [currentView, setCurrentView] = useState(currentUser ? 'dashboard' : 'home');

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

  // Multi-slide triage state
  const [triageState, setTriageState] = useState({});
  const updateTriageState = (slide, data) => {
    setTriageState(prev => ({ ...prev, [slide]: data }));
  };

  // Find Doctor filter from Symptom Checker
  const [filterDepartment, setFilterDepartment] = useState(null);

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_APPOINTMENTS, appointments); }, [appointments]);
  useEffect(() => { saveToStorage(STORAGE_HISTORY, triageHistory); }, [triageHistory]);

  // Auth handlers
  const handleLogin = (email, password) => {
    const user = authLogin(email, password);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignup = (email, password, name) => {
    const user = authSignup(email, password, name);
    setCurrentUser(user);
    setCurrentView('patient-details');
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const executeTriage = async (symptomsToAnalyze) => {
    setIsLoading(true);
    setError(null);
    setTriageResult(null);

    try {
      const result = await analyzeSymptoms(symptomsToAnalyze);
      setTriageResult(result);

      setTriageHistory(prev => [{
        symptoms: symptomsToAnalyze,
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

  const handleTriage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symptoms.trim()) return;
    executeTriage(symptoms);
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

  // Public pages (no sidebar)
  const publicViews = ['home', 'login', 'signup'];
  const isPublicView = publicViews.includes(currentView);

  // If not logged in and trying to access private views, redirect
  if (!currentUser && !isPublicView) {
    setCurrentView('home');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-200">

      {/* Sidebar — only on authenticated views */}
      {!isPublicView && currentUser && (
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

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

      <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all ${!isPublicView ? 'lg:ml-64' : ''}`}>
        {/* Public Views */}
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}
        {currentView === 'login' && (
          <LoginView
            onLogin={handleLogin}
            onGoToSignup={() => setCurrentView('signup')}
            onGoHome={() => setCurrentView('home')}
          />
        )}
        {currentView === 'signup' && (
          <SignupView
            onSignup={handleSignup}
            onGoToLogin={() => setCurrentView('login')}
            onGoHome={() => setCurrentView('home')}
          />
        )}

        {/* Authenticated Views */}
        <div className={!isPublicView ? 'px-4 sm:px-6 lg:px-8 py-4' : ''}>
          {currentView === 'patient-details' && (
            <PatientDetailsView
              setCurrentView={setCurrentView}
              updateTriageState={updateTriageState}
              initialData={triageState.slideOne}
            />
          )}

          {currentView === 'slide-two' && (
            <SlideTwoQuery
              setCurrentView={setCurrentView}
              updateTriageState={updateTriageState}
              initialData={triageState.slideTwo}
            />
          )}

          {currentView === 'slide-three' && (
            <SlideThreePrefs
              setCurrentView={setCurrentView}
              updateTriageState={updateTriageState}
              initialData={triageState.slideThree}
              triageState={triageState}
              setSymptoms={setSymptoms}
              handleTriage={handleTriage}
            />
          )}

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
              triageHistory={triageHistory}
            />
          )}

          {currentView === 'find-doctor' && (
            <FindDoctorView
              setCurrentView={setCurrentView}
              filterDepartment={filterDepartment}
            />
          )}

          {currentView === 'symptom-checker' && (
            <SymptomCheckerView
              setCurrentView={setCurrentView}
              analyzeSymptomsFn={analyzeSymptoms}
              setFilterDepartment={setFilterDepartment}
            />
          )}

          {currentView === 'pharmacy' && (
            <PharmacyView />
          )}

          {currentView === 'records' && (
            <MedicalRecordsView triageHistory={triageHistory} />
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
