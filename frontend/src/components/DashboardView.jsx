import { useState } from 'react';
import { Calendar, Activity, Pill, HeartPulse, Clock, TrendingUp, ArrowRight, Bell } from 'lucide-react';

export default function DashboardView({ appointments, setCurrentView, triageHistory }) {
    const getUrgencyColor = (level) => {
        if (level >= 4) return 'bg-red-100 text-red-700 border-red-200';
        if (level === 3) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const stats = [
        { label: 'Upcoming', value: appointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Triage Done', value: triageHistory?.length || 0, icon: HeartPulse, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Refills', value: 2, icon: Pill, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Health Score', value: '87%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const notifications = [
        { text: 'Your prescription refill is ready for pickup at Apollo Pharmacy.', time: '10 min ago', type: 'success' },
        { text: 'Dr. Priya Sharma confirmed your appointment for tomorrow.', time: '1 hr ago', type: 'info' },
        { text: 'New lab report available. Click to view results.', time: '3 hrs ago', type: 'warning' },
    ];

    const healthTips = [
        "💧 Stay hydrated — aim for 8 glasses of water today.",
        "🏃 A 30-minute walk can reduce stress and improve heart health.",
        "😴 Adults need 7-9 hours of quality sleep each night.",
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Welcome back! 👋</h2>
                <p className="text-slate-500 mt-1">Here's your health overview for today.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button onClick={() => setCurrentView('patient-details')} className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left group">
                            <HeartPulse className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Start Triage</p>
                                <p className="text-xs text-slate-500">AI symptom check</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setCurrentView('find-doctor')} className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors text-left group">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Find Doctor</p>
                                <p className="text-xs text-slate-500">Book appointment</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => setCurrentView('pharmacy')} className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors text-left group">
                            <Pill className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="text-sm font-bold text-slate-900">Refill Rx</p>
                                <p className="text-xs text-slate-500">Upload prescription</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
                    <h3 className="text-lg font-bold mb-3">💡 Health Tip</h3>
                    <p className="text-emerald-50 text-sm leading-relaxed">{healthTips[new Date().getDate() % healthTips.length]}</p>
                </div>
            </div>

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
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 3).map((apt) => (
                                <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-center min-w-[50px]">
                                        <p className="text-xs font-bold text-slate-400">{apt.date === new Date().toLocaleDateString() ? 'Today' : apt.date}</p>
                                        <p className="text-lg font-black text-slate-900">{apt.time?.split(' ')[0]}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{apt.department}</p>
                                        <p className="text-xs text-slate-500 truncate">{apt.patientName}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getUrgencyColor(apt.urgency)}`}>P{apt.urgency}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-indigo-600" /> Notifications
                    </h3>
                    <div className="space-y-3">
                        {notifications.map((notif, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700 leading-relaxed">{notif.text}</p>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
