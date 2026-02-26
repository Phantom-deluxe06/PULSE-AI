import { Calendar, Clock, MapPin, Activity, CheckCircle2 } from 'lucide-react';

export default function DashboardView({ appointments, setCurrentView }) {
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
                <button
                    onClick={() => setCurrentView('query')}
                    className="bg-blue-100 text-blue-700 px-6 py-2 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                >
                    + New Triage
                </button>
            </div>

            {/* Appointments List */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" /> Upcoming Appointments
                </h3>

                {appointments.length === 0 ? (
                    <div className="text-center p-12 bg-white border border-slate-200 shadow-sm rounded-3xl">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No appointments scheduled</h3>
                        <p className="text-slate-500 mt-2">Start a new triage query to book an appointment.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.map((apt) => (
                            <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                                    {/* Date/Time Block */}
                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl min-w-[120px] text-center shrink-0 border border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 uppercase">{apt.date === new Date().toLocaleDateString() ? "Today" : apt.date}</span>
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
                                        <p className="text-slate-600 font-medium">Patient: {apt.patientName}</p>

                                        {/* Triage Summary Inject */}
                                        <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                                            <strong className="text-slate-700 block mb-1">AI Triage Summary:</strong>
                                            <span className="text-slate-600">{apt.triageSummary}</span>
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
                )}
            </div>
        </div>
    );
}
