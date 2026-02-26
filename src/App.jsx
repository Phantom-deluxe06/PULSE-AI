import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import BookingView from './components/BookingView';
import DashboardView from './components/DashboardView';
import QueryView from './components/QueryView';
import { analyzeSymptoms } from './api';
import { TIME_SLOTS } from './constants';

function App() {
  // Person B: View State
  const [currentView, setCurrentView] = useState('home'); // home, query, booking, dashboard

  // Person A: Core Logic State
  const [appointments, setAppointments] = useState([]);
  const [triageResult, setTriageResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Person A: Booking Logic State
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');

  // Person A: Handlers
  const handleTriage = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeSymptoms(symptoms);
      setTriageResult(result);
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
      department: triageResult.department,
      date: new Date().toLocaleDateString(), // Mocking today
      time: selectedSlot.time,
      urgency: triageResult.urgency,
      status: "Confirmed",
      triageSummary: triageResult.summary,
      recommendation: triageResult.recommendation,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    setCurrentView('dashboard');

    // Reset state
    setTriageResult(null);
    setSymptoms('');
    setSelectedSlot(null);
    setPatientName('');
  };

  // Filter slots for current department
  const availableSlots = TIME_SLOTS.filter(s =>
    (!triageResult || s.department === triageResult.department) && s.available
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
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
