import { useState, useEffect } from 'react';
import { Activity, Clock, ShieldAlert, CheckCircle2, User, Building2 } from 'lucide-react';
import { getAllAppointments, updateAppointmentStatus } from '../utils/auth';

export default function AdminDashboardView() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setIsLoading(true);
        try {
            const data = await getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to load appointments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateAppointmentStatus(id, newStatus);
            // Optimistic UI update
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status. If you just set up Supabase, ensure you ran the admin_setup.sql script to allow admin updates.");
        }
    };

    const getUrgencyBadge = (level) => {
        if (level >= 4) return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> CRITICAL (L{level})</span>;
        if (level === 3) return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">URGENT (L3)</span>;
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">ROUTINE (L{level})</span>;
    };

    const pendingCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;
    const criticalCount = appointments.filter(a => a.urgency >= 4 && (a.status === 'Confirmed' || a.status === 'Pending')).length;

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-600" />
                    Doctor Command Center
                </h2>
                <p className="text-slate-500 mt-2">Manage incoming triage queue and patient assignments.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Queue</p>
                        <p className="text-4xl font-black text-slate-900">{appointments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Triage</p>
                        <p className="text-4xl font-black text-slate-900">{pendingCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-red-600 rounded-2xl p-6 shadow-md shadow-red-500/20 flex items-center justify-between text-white">
                    <div>
                        <p className="text-sm font-bold text-red-200 uppercase tracking-wider mb-1">Critical Priority</p>
                        <p className="text-4xl font-black">{criticalCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/50 rounded-xl flex items-center justify-center">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">Active Patient Queue</h3>
                    <button onClick={loadAppointments} className="text-sm text-blue-600 font-semibold hover:underline">
                        Refresh Queue
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-slate-500">Loading incoming patients...</div>
                ) : appointments.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Queue is Empty</h3>
                        <p className="text-slate-500">No patients are currently waiting for triage.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {appointments.map((apt) => (
                            <div key={apt.id} className={`p-6 transition-colors hover:bg-slate-50 ${apt.urgency >= 4 && (apt.status === 'Confirmed' || apt.status === 'Pending') ? 'bg-red-50/30' : ''}`}>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                                    {/* Patient Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-slate-900">{apt.patientName}</h4>
                                            {getUrgencyBadge(apt.urgency)}
                                            <span className={`text-xs px-2 py-1 rounded-md font-bold ${apt.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                                                {apt.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4" /> {apt.department}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" /> {apt.date} @ {apt.time}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <p className="text-xs font-bold uppercase text-slate-400 mb-1">AI Triage Summary</p>
                                            <p className="text-sm text-slate-700 font-medium mb-2">{apt.triageSummary || 'No summary provided.'}</p>
                                            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Recommended Action</p>
                                            <p className="text-sm text-slate-600">{apt.recommendation || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        {apt.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(apt.id, 'Completed')}
                                                className="w-full px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold text-sm rounded-xl transition-colors"
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                        {apt.status === 'Completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}
                                                className="w-full px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-sm rounded-xl transition-colors"
                                            >
                                                Reopen Case
                                            </button>
                                        )}
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
