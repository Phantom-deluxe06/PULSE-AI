import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
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
import ProfileView from './components/ProfileView';
import QueryView from './components/QueryView';
import EmergencyAlert from './components/EmergencyAlert';
import BookingConfirmation from './components/BookingConfirmation';
import AdminDashboardView from './components/AdminDashboardView';
import TriageHistory from './components/TriageHistory';
import ToastContainer from './components/Toast';
import ChatBot from './components/ChatBot';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';
import { login as authLogin, signup as authSignup, logout as authLogout } from './utils/auth';
import { supabase } from './supabase';
import { useToast } from './utils/useToast';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [currentView, setCurrentView] = useState(() => {
    // Restore view from URL hash on load
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const { toasts, showToast, removeToast } = useToast();

  const navigate = (view) => {
    setCurrentView(view);
    window.history.pushState({ view }, '', `#${view}`);
  };

  const isAdmin = currentUser?.email === 'admin@pulse.ai';

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Browser back/forward button support
  useEffect(() => {
    const handlePop = (e) => {
      const view = e.state?.view || window.location.hash.replace('#', '') || 'home';
      setCurrentView(view);
    };
    window.addEventListener('popstate', handlePop);
    // Set initial history entry so back button works from first page
    window.history.replaceState({ view: currentView }, '', `#${currentView}`);
    return () => window.removeEventListener('popstate', handlePop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize auth state (no currentView dep — prevents re-registering on every nav)
  useEffect(() => {
    // Guard: supabase may be null if env vars are missing
    if (!supabase) {
      setAuthInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setAuthInitialized(true);
    }).catch(() => {
      // Supabase unreachable — still mark as initialized so app renders
      setAuthInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // run once only

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_APPOINTMENTS, appointments); }, [appointments]);
  useEffect(() => { saveToStorage(STORAGE_HISTORY, triageHistory); }, [triageHistory]);

  // Auth handlers
  const handleLogin = async (email, password) => {
    try {
      const user = await authLogin(email, password);
      setCurrentUser(user);
      navigate('dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleSignup = async (email, password, name) => {
    try {
      const user = await authSignup(email, password, name);
      setCurrentUser(user);
      navigate('patient-details');
    } catch (err) {
      showToast(err.message || 'Sign up failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setCurrentUser(null);
    navigate('home');
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
      } else {
        showToast(`Routed to ${result.department} — Urgency P${result.urgency}`, 'success');
      }
    } catch (err) {
      const msg = err.message || 'An error occurred during triage. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symptoms.trim()) return;
    executeTriage(symptoms);
  };

  const handleBookSlot = (selectedDate) => {
    if (!selectedSlot || !patientName.trim()) return;

    const appointmentDate = selectedDate?.dateObj
      ? selectedDate.dateObj.toLocaleDateString()
      : new Date().toLocaleDateString();

    const newAppointment = {
      id: Date.now().toString(),
      patientName,
      department: triageResult?.department || 'General Medicine',
      date: appointmentDate,
      time: selectedSlot.time,
      urgency: triageResult?.urgency || 1,
      status: "Confirmed",
      triageSummary: triageResult?.summary || '',
      recommendation: triageResult?.recommendation || '',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    setConfirmedAppointment(newAppointment);
    navigate('confirmation');
    setTriageResult(null);
    setSymptoms('');
    setSelectedSlot(null);
    setPatientName('');
  };

  const handleDoctorBook = (details) => {
    const newAppointment = {
      id: Date.now().toString(),
      patientName: currentUser?.name || 'Patient',
      doctorName: details.doctorName,
      department: details.department,
      hospital: details.hospital,
      date: details.date,
      time: details.time,
      fee: details.fee,
      urgency: 1,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
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

  // Guard: unauthenticated users can't access private views
  useEffect(() => {
    if (authInitialized && !currentUser && !publicViews.includes(currentView)) {
      navigate('home');
    }
  }, [authInitialized, currentUser, currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render nothing until authentication state is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Sidebar and ChatBot — only on authenticated non-home views */}
      {!isPublicView && currentUser && (
        <>
          <Sidebar
            currentView={currentView}
            setCurrentView={navigate}
            currentUser={{
              name: currentUser.user_metadata?.full_name || currentUser.email,
              email: currentUser.email
            }}
            isAdmin={isAdmin}
            onLogout={handleLogout}
            isOpen={isMobileMenuOpen}
            setIsOpen={setIsMobileMenuOpen}
          />
          <BottomNav
            currentView={currentView}
            setCurrentView={navigate}
            onOpenMenu={() => setIsMobileMenuOpen(true)}
          />
          <ChatBot />
        </>
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

      <main className={`flex-1 flex flex-col min-h-screen overflow-y-auto transition-all pb-24 lg:pb-0 ${!isPublicView ? 'lg:ml-64' : ''}`}>
        {/* Public Views */}
        {currentView === 'home' && <HomeView setCurrentView={navigate} />}
        {currentView === 'login' && (
          <LoginView
            onLogin={handleLogin}
            onGoToSignup={() => navigate('signup')}
            onGoHome={() => navigate('home')}
          />
        )}
        {currentView === 'signup' && (
          <SignupView
            onSignup={handleSignup}
            onGoToLogin={() => navigate('login')}
            onGoHome={() => navigate('home')}
          />
        )}

        {/* Authenticated Views */}
        <div className={!isPublicView ? 'px-4 sm:px-6 lg:px-8 py-4' : ''}>
          {currentView === 'patient-details' && (
            <PatientDetailsView
              setCurrentView={navigate}
              updateTriageState={updateTriageState}
              initialData={triageState.slideOne}
            />
          )}

          {currentView === 'slide-two' && (
            <SlideTwoQuery
              setCurrentView={navigate}
              updateTriageState={updateTriageState}
              initialData={triageState.slideTwo}
            />
          )}

          {currentView === 'slide-three' && (
            <SlideThreePrefs
              setCurrentView={navigate}
              updateTriageState={updateTriageState}
              initialData={triageState.slideThree}
              triageState={triageState}
              setSymptoms={setSymptoms}
              handleTriage={handleTriage}
            />
          )}

          {currentView === 'query' && (
            <QueryView
              setCurrentView={navigate}
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
              setCurrentView={navigate}
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
                navigate('dashboard');
              }}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              setCurrentView={navigate}
              appointments={appointments}
              triageHistory={triageHistory}
            />
          )}

          {currentView === 'find-doctor' && (
            <FindDoctorView
              setCurrentView={navigate}
              filterDepartment={filterDepartment}
              onBookAppointment={handleDoctorBook}
            />
          )}

          {currentView === 'symptom-checker' && (
            <SymptomCheckerView
              setCurrentView={navigate}
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

          {currentView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'history' && (
            <TriageHistory
              history={triageHistory}
              onClearHistory={handleClearHistory}
              setCurrentView={navigate}
            />
          )}

          {currentView === 'admin-dashboard' && isAdmin && (
            <AdminDashboardView />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
