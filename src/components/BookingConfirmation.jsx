import { useEffect } from 'react';
import { CheckCircle2, Calendar, Clock, Building2, User, Download } from 'lucide-react';
import { generateReceiptPDF } from '../utils/receipt';

export default function BookingConfirmation({ appointment, onGoToDashboard }) {

    // Auto-redirect after 4 seconds
    useEffect(() => {
        const timer = setTimeout(onGoToDashboard, 4000);
        return () => clearTimeout(timer);
    }, [onGoToDashboard]);

    const getUrgencyColor = (level) => {
        if (level >= 4) return 'bg-red-100 text-red-700';
        if (level === 3) return 'bg-amber-100 text-amber-700';
        return 'bg-emerald-100 text-emerald-700';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in duration-500">

            {/* Animated Checkmark */}
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-600 animate-in zoom-in duration-500" />
                </div>
                {/* Ripple rings */}
                <span className="absolute inset-0 rounded-full bg-green-200 opacity-40 animate-ping" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-black text-slate-900 mb-2 text-center">Booking Confirmed!</h2>
            <p className="text-slate-500 text-base text-center mb-8">
                Your appointment has been successfully scheduled.
            </p>

            {/* Appointment Summary Card */}
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <p className="text-xs text-blue-200 font-semibold uppercase tracking-widest">Appointment Details</p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Patient</p>
                            <p className="font-bold text-slate-900">{appointment.patientName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Department</p>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">{appointment.department}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getUrgencyColor(appointment.urgency)}`}>
                                    Urgency {appointment.urgency}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Scheduled At</p>
                            <p className="font-bold text-slate-900">{appointment.date} at {appointment.time}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-sm text-slate-400 mt-6 animate-pulse">Redirecting to Dashboard in a few seconds...</p>

            <div className="mt-6 flex items-center gap-4">
                <button
                    onClick={() => generateReceiptPDF(appointment)}
                    className="px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-900 transition flex items-center gap-2"
                >
                    <Download className="w-4 h-4" /> Download Receipt
                </button>
                <button
                    onClick={onGoToDashboard}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                >
                    Go to Dashboard now →
                </button>
            </div>
        </div>
    );
}
