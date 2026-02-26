import { useState } from 'react';
import { Calendar, Clock, ChevronRight, CheckCircle2, User, Building2 } from 'lucide-react';

export default function BookingView({ setCurrentView }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isBooked, setIsBooked] = useState(false);

    const dates = ['Today', 'Tomorrow', 'Oct 28', 'Oct 29', 'Oct 30'];
    const times = ['09:00 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'];

    // Hardcoded for UI visualization, Person A will connect this later
    const recommendedDept = "Cardiology";
    const urgencyLevel = 4; // High Urgency

    const handleBook = () => {
        setIsBooked(true);
        setTimeout(() => {
            setCurrentView('dashboard');
        }, 2000);
    };

    if (isBooked) {
        return (
            <div className="flex flex-col animate-in fade-in duration-500 items-center justify-center h-[70vh]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 animate-in zoom-in duration-300" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                <p className="text-slate-600">Your appointment has been scheduled successfully.</p>
                <p className="text-sm text-slate-500 mt-4 animate-pulse">Redirecting to Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Schedule Appointment</h2>
                <p className="text-slate-600 mt-1">Select a time for your consultation</p>
            </div>

            {/* Triage Recommendation Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recommended</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Priority {urgencyLevel}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-blue-600" /> {recommendedDept}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">Based on your triage assessment</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 hidden sm:flex">
                    <User className="w-6 h-6" />
                </div>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" /> Select Date
                </h4>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {dates.map((date) => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`shrink-0 px-5 py-3 rounded-xl font-medium text-sm transition-all border ${selectedDate === date
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            {date}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div className="mb-10 animate-in fade-in duration-300">
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-500" /> Select Time
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {times.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all border ${selectedTime === time
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Footer */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-slate-600 text-center sm:text-left">
                    {selectedDate && selectedTime ? (
                        <p>Selected: <strong className="text-slate-900">{selectedDate}</strong> at <strong className="text-slate-900">{selectedTime}</strong></p>
                    ) : (
                        <p>Please select a date and time to continue.</p>
                    )}
                </div>
                <button
                    onClick={handleBook}
                    disabled={!selectedDate || !selectedTime}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${selectedDate && selectedTime
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Confirm Appointment <ChevronRight className="ml-1 w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
