import { Activity } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
    return (
        <header className="w-full bg-white border-b border-slate-200 p-4 shrink-0 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setCurrentView('home')}
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        PULSE <span className="text-blue-600">AI</span>
                    </h1>
                </div>
                <nav className="flex gap-6">
                    <button
                        onClick={() => setCurrentView('home')}
                        className={`text-sm font-semibold transition-colors duration-200 ${currentView === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setCurrentView('dashboard')}
                        className={`text-sm font-semibold transition-colors duration-200 ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Dashboard
                    </button>
                </nav>
            </div>
        </header>
    );
}
