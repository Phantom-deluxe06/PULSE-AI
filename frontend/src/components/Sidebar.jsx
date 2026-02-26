import { LayoutDashboard, Stethoscope, Clock, CalendarCheck, X, Menu, LogOut, UserCircle, ClipboardList } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patient-details', label: 'Start Triage', icon: ClipboardList },
    { id: 'query', label: 'Symptoms Check', icon: Stethoscope },
    { id: 'history', label: 'Triage History', icon: Clock },
];

export default function Sidebar({ currentView, setCurrentView, currentUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 transition"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Logo */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <CalendarCheck className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            PULSE <span className="text-blue-600">AI</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* User Card */}
                {currentUser && (
                    <div className="px-4 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setCurrentView(item.id); setIsOpen(false); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                {item.label}
                                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-4">
                    <button
                        onClick={() => { onLogout(); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400 text-center">PULSE AI v1.2</p>
                </div>
            </aside>
        </>
    );
}
