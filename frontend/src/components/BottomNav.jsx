import { LayoutDashboard, UserSearch, HeartPulse, Menu } from 'lucide-react';

export default function BottomNav({ currentView, setCurrentView, onOpenMenu }) {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'symptom-checker', label: 'Triage', icon: HeartPulse },
        { id: 'find-doctor', label: 'Doctors', icon: UserSearch }
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 px-2 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className="flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-all"
                        >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-primary font-bold' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                {/* Hamburger Menu Trigger */}
                <button
                    onClick={onOpenMenu}
                    className="flex flex-col items-center justify-center w-16 h-12 gap-1 rounded-xl transition-all"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
                        <Menu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">
                        Menu
                    </span>
                </button>
            </div>
        </nav>
    );
}
