import { useState, useEffect } from 'react';
import { Calendar, Activity, Pill, HeartPulse, Clock, TrendingUp, ArrowRight, History, Droplets, Footprints, Moon, Leaf, Wind, Sun, Lightbulb } from 'lucide-react';

const HEALTH_TIPS = [
    { icon: Droplets, color: 'text-sky-500', text: 'Stay hydrated — aim for 8 glasses of water today.' },
    { icon: Footprints, color: 'text-emerald-500', text: 'A 30-minute walk reduces stress and improves heart health.' },
    { icon: Moon, color: 'text-indigo-400', text: 'Adults need 7–9 hours of quality sleep each night.' },
    { icon: Leaf, color: 'text-green-500', text: 'Include leafy greens in at least one meal today for iron and vitamins.' },
    { icon: Wind, color: 'text-teal-400', text: 'Try 5 minutes of deep breathing to reduce anxiety and cortisol levels.' },
    { icon: Sun, color: 'text-amber-400', text: 'Get 10–15 minutes of sunlight daily for natural vitamin D.' },
];

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardView({ appointments, setCurrentView, triageHistory }) {
    const [tipIndex, setTipIndex] = useState(() => new Date().getDate() % HEALTH_TIPS.length);
    const [tipVisible, setTipVisible] = useState(true);

    // Rotate health tip every 8 seconds with fade
    useEffect(() => {
        const interval = setInterval(() => {
            setTipVisible(false);
            setTimeout(() => {
                setTipIndex(prev => (prev + 1) % HEALTH_TIPS.length);
                setTipVisible(true);
            }, 400);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const getUrgencyColor = (level) => {
        if (level >= 4) return 'bg-red-100 text-red-700 border-red-200';
        if (level === 3) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const lastTriage = triageHistory?.[0];
    const currentTip = HEALTH_TIPS[tipIndex];

    const stats = [
        { label: 'Upcoming', value: appointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Triage Done', value: triageHistory?.length || 0, icon: HeartPulse, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: lastTriage ? timeAgo(lastTriage.timestamp) : null },
        { label: 'Refills Due', value: 2, icon: Pill, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Health Score', value: '87%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-8 px-4">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{getGreeting()}!</h2>
                <p className="text-slate-500 mt-1">Here's your health overview for today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                            {stat.sub && <p className="text-[10px] text-slate-400 mt-0.5">Last: {stat.sub}</p>}
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions + Health Tip */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { view: 'patient-details', icon: HeartPulse, label: 'Start Triage', sub: 'AI symptom check', bg: 'bg-blue-50 hover:bg-blue-100', color: 'text-blue-600' },
                            { view: 'find-doctor', icon: Calendar, label: 'Find Doctor', sub: 'Book appointment', bg: 'bg-indigo-50 hover:bg-indigo-100', color: 'text-indigo-600' },
                            { view: 'pharmacy', icon: Pill, label: 'Refill Rx', sub: 'Upload prescription', bg: 'bg-amber-50 hover:bg-amber-100', color: 'text-amber-600' },
                        ].map(a => {
                            const Icon = a.icon;
                            return (
                                <button
                                    key={a.view}
                                    onClick={() => setCurrentView(a.view)}
                                    className={`flex items-center gap-3 p-4 rounded-xl ${a.bg} transition-colors text-left group`}
                                >
                                    <Icon className={`w-5 h-5 ${a.color} shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{a.label}</p>
                                        <p className="text-xs text-slate-500">{a.sub}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Rotating Health Tip */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-white" /> Health Tip
                    </h3>
                    <div className={`transition-opacity duration-400 ${tipVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {(() => { const TipIcon = currentTip.icon; return <TipIcon className={`w-8 h-8 mb-2 ${currentTip.color} bg-white/20 rounded-xl p-1.5`} />; })()}
                        <p className="text-emerald-50 text-sm leading-relaxed">{currentTip.text}</p>
                    </div>
                    <div className="flex gap-1 mt-4">
                        {HEALTH_TIPS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setTipVisible(false); setTimeout(() => { setTipIndex(i); setTipVisible(true); }, 300); }}
                                className={`h-1 rounded-full transition-all ${i === tipIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointments + Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" /> Upcoming
                        </h3>
                        <button onClick={() => setCurrentView('find-doctor')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="text-center py-8">
                            <Activity className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-medium">No upcoming appointments</p>
                            <button onClick={() => setCurrentView('find-doctor')} className="mt-3 text-xs text-blue-600 font-semibold hover:underline">Book one →</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 3).map((apt) => (
                                <div key={apt.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-center min-w-[50px] pt-0.5">
                                        <p className="text-xs font-bold text-slate-400">{apt.date === new Date().toLocaleDateString() ? 'Today' : apt.date}</p>
                                        <p className="text-lg font-black text-slate-900">{apt.time?.split(' ')[0]}</p>
                                        <p className="text-[10px] text-slate-400">{apt.time?.split(' ')[1]}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{apt.doctorName || apt.department}</p>
                                        <p className="text-xs text-slate-500 truncate">{apt.department}{apt.hospital ? ` · ${apt.hospital}` : ''}</p>
                                        {apt.triageSummary && <p className="text-xs text-slate-400 mt-1 truncate">{apt.triageSummary}</p>}
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">{apt.status || 'Confirmed'}</span>
                                            {apt.fee && <span className="text-[10px] text-slate-400 font-medium">{apt.fee}</span>}
                                            {apt.patientName && <span className="text-[10px] text-slate-400">· {apt.patientName}</span>}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getUrgencyColor(apt.urgency)}`}>P{apt.urgency}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Triage History */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-600" /> Recent Triages
                        </h3>
                        {triageHistory?.length > 0 && (
                            <button onClick={() => setCurrentView('history')} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                        )}
                    </div>
                    {!triageHistory?.length ? (
                        <div className="text-center py-8">
                            <HeartPulse className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-medium">No triage history yet</p>
                            <button onClick={() => setCurrentView('patient-details')} className="mt-3 text-xs text-blue-600 font-semibold hover:underline">Start triage →</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {triageHistory.slice(0, 3).map((t, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${t.urgency >= 4 ? 'bg-red-500' : t.urgency === 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{t.department}</p>
                                        <p className="text-xs text-slate-500 truncate">{t.summary}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(t.timestamp)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
