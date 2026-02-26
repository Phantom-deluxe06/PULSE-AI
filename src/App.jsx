import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import PatientDetailsView from './components/PatientDetailsView';
import BookingView from './components/BookingView';
import DashboardView from './components/DashboardView';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, query, booking, dashboard

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto relative overflow-hidden">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} />}

        {currentView === 'patient-details' && <PatientDetailsView setCurrentView={setCurrentView} />}

        {currentView === 'query' && (
          <div className="text-center">Query View Placeholder</div>
        )}

        {currentView === 'booking' && <BookingView setCurrentView={setCurrentView} />}

        {currentView === 'dashboard' && <DashboardView />}
      </main>
    </div>
  );
}

export default App;
