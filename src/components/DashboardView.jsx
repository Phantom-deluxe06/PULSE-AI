import { useState } from 'react';
import { Calendar, Clock, MapPin, Activity, ChevronDown, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function DashboardView() {
    const [historyOpen, setHistoryOpen] = useState(false);

    // Mock Data (To be connected by Person A)
    const appointments = [
        {
            id: 1,
            department: "Cardiology",
            date: "Tomorrow",
            time: "10:30 AM",
            doctor: "Dr. Sarah Jenkins",
            status: "Confirmed",
            urgency: 4, // High -> Red
            location: "Building C, Floor 3, Room 302"
        },
        {
            id: 2,
            department: "Dermatology",
            date: "Oct 28",
            time: "02:00 PM",
            doctor: "Dr. Michael Chen",
            status: "Pending",
            urgency: 2, // Low -> Green
            location: "Building A, Floor 1, Room 105"
        }
    ];

    const triageHistory = [
        {
            date: "Oct 25, 2026",
            symptoms: "Severe chest pain, shortness of breath, left arm numbness.",
            result: "Cardiology (Urgency: 4)",
            action: "Appointment Booked"
        },
        {
            date: "Sep 12, 2026",
            symptoms: "Mild skin rash on forearm, itchy, no fever.",
            result: "Dermatology (Urgency: 2)",
            action: "Appointment Booked"
        }
    ];

    const getUrgencyColor = (level) => {
        if (level >= 4) return 'bg-red-100 text-red-700 border-red-200';
        if (level === 3) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Your Dashboard</h2>
                    <p className="text-slate-600 mt-1">Manage your appointments and triage history</p>
                </div>
            </div>

            {/* Appointments List */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" /> Upcoming Appointments
                </h3>
                <div className="grid gap-6">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                                {/* Date/Time Block */}
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl min-w-[120px] text-center shrink-0 border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-500 uppercase">{apt.date}</span>
                                    <span className="text-2xl font-black text-slate-900 my-1">{apt.time.split(' ')[0]}</span>
                                    <span className="text-sm font-bold text-slate-600">{apt.time.split(' ')[1]}</span>
                                </div>

                                {/* Details Block */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getUrgencyColor(apt.urgency)}`}>
                                            Urgency {apt.urgency}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {apt.status === 'Confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {apt.status}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-1">{apt.department}</h4>
                                    <p className="text-slate-600 font-medium">{apt.doctor}</p>

                                    <div className="mt-4 flex items-center text-sm text-slate-500 gap-2">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        <span>{apt.location}</span>
                                    </div>
                                </div>

                                {/* Actions Block */}
                                <div className="flex sm:flex-col justify-end gap-3 shrink-0">
                                    <button className="px-5 py-2 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Reschedule</button>
                                    <button className="px-5 py-2 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 transition-colors">Cancel</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Triage History Accordion */}
            <div>
                <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="w-full flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-900">Triage History</h3>
                            <p className="text-sm text-slate-500">View past symptom assessments and logic records</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`} />
                </button>

                {historyOpen && (
                    <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner p-2">
                        <ul className="divide-y divide-slate-100">
                            {triageHistory.map((item, idx) => (
                                <li key={idx} className="p-4 sm:p-5 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{item.date}</span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.action}</span>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm font-medium text-slate-700 flex items-start line-clamp-2">
                                            <FileText className="w-4 h-4 text-slate-400 mr-2 mt-0.5 shrink-0" /> {item.symptoms}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 inline-flex items-center gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4 text-slate-500" />
                                        <strong className="text-slate-800">Result:</strong>
                                        <span className="text-slate-600">{item.result}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}
