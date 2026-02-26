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
import QueryView from './components/QueryView';
import EmergencyAlert from './components/EmergencyAlert';
import BookingConfirmation from './components/BookingConfirmation';
import TriageHistory from './components/TriageHistory';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';
import { supabase } from './supabase';
import {
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  getAppointments,
  saveAppointment,
  getTriageHistory,
  saveTriageHistory,
  clearTriageHistory
} from './utils/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const [appointments, setAppointments] = useState([]);
  const [triageHistory, setTriageHistory] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');

  // Multi-slide triage state
  const [triageState, setTriageState] = useState({});
  const updateTriageState = (slide, data) => {
    setTriageState(prev => ({ ...prev, [slide]: data }));
  };

  // Initialize Auth & Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) setCurrentView('dashboard');
      setAuthInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when user logs in
  useEffect(() => {
    if (currentUser) {
      getAppointments().then(setAppointments).catch(console.error);
      getTriageHistory().then(setTriageHistory).catch(console.error);
    } else {
      setAppointments([]);
      setTriageHistory([]);
    }
  }, [currentUser]);

  // Auth handlers
  const handleLogin = async (email, password) => {
    const user = await authLogin(email, password);
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignup = async (email, password, name) => {
    const user = await authSignup(email, password, name);
    setCurrentUser(user);
    setCurrentView('patient-details');
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Triage logic
  const handleTriage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setTriageResult(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      setTriageResult(result);

      const historyItem = {
        symptoms,
        department: result.department,
        urgency: result.urgency,
        summary: result.summary,
        recommendation: result.recommendation,
      };

      if (currentUser) {
        await saveTriageHistory(historyItem);
        // Refresh local history
        const updatedHistory = await getTriageHistory();
        setTriageHistory(updatedHistory);
      }

      if (result.urgency === 5) {
        setShowEmergency(true);
      }
    } catch (err) {
      setError(err.message || "An error occurred during triage. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Booking logic
  const handleBookSlot = async () => {
    if (!selectedSlot || !patientName.trim()) return;

    const newAppointment = {
      patientName,
      department: triageResult?.department || 'General Medicine',
      date: new Date().toLocaleDateString(),
      time: selectedSlot.time,
      urgency: triageResult?.urgency || 1,
      status: "Confirmed",
      triageSummary: triageResult?.summary || '',
      recommendation: triageResult?.recommendation || '',
    };

    try {
      if (currentUser) {
        await saveAppointment(newAppointment);
        const updatedAppts = await getAppointments();
        setAppointments(updatedAppts);
      }

      setConfirmedAppointment({
        ...newAppointment,
        id: Date.now().toString() // For UI rendering
      });
      setCurrentView('confirmation');
      setTriageResult(null);
      setSymptoms('');
      setSelectedSlot(null);
      setPatientName('');
    } catch (err) {
      console.error(err);
      alert("Failed to save appointment. Please try again.");
    }
  };

  const handleClearHistory = async () => {
    if (currentUser) {
      await clearTriageHistory();
      setTriageHistory([]);
    }
  };

  const availableSlots = TIME_SLOTS.filter(s =>
    (!triageResult || s.department === triageResult.department) && s.available
  );

  // Public pages (no sidebar)
  const publicViews = ['home', 'login', 'signup'];
  const isPublicView = publicViews.includes(currentView);

  if (!authInitialized) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  // Auto-redirect if trying to access private view logged out
  if (!currentUser && !isPublicView) {
    setCurrentView('home');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-200">

      {!isPublicView && currentUser && (
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={{
            name: currentUser.user_metadata?.full_name || currentUser.email,
            email: currentUser.email
          }}
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
