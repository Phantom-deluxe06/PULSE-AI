import { Calendar, Clock, ChevronRight, CheckCircle2, User, Building2 } from 'lucide-react';

export default function BookingView({
    setCurrentView,
    triageResult,
    patientName,
    setPatientName,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    handleBookSlot
}) {
    // If we haven't triaged yet but ended up here, provide defaults
    const recommendedDept = triageResult ? triageResult.department : "General Medicine";
    const urgencyLevel = triageResult ? triageResult.urgency : 1;

    // Use availableSlots grouped by Date (Mocking dates based on slots)
    // In our mock TIME_SLOTS, they are all just "times", so we will just show "Today"
    const dates = ['Today'];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Schedule Appointment</h2>
                <p className="text-slate-600 mt-1">
                    {triageResult ? `Auto-filtered for ${recommendedDept} based on AI assessment` : 'Select a time for your consultation'}
                </p>
            </div>

            {/* Triage Recommendation Card */}
            {triageResult && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recommended</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${urgencyLevel >= 4 ? 'bg-red-100 text-red-700' :
                                    urgencyLevel === 3 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                Priority {urgencyLevel}
                            </span>
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
            )}

            {/* Patient Name Input */}
            <div className="mb-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-500" /> Patient Details
                </h4>
                <input
                    type="text"
                    placeholder="Enter Patient Full Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full sm:max-w-md p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
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
                            className={'shrink-0 px-5 py-3 rounded-xl font-medium text-sm transition-all border bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'}
                        >
                            {date}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            <div className="mb-10 animate-in fade-in duration-300">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-500" /> Select Time
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.length > 0 ? availableSlots.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all border ${selectedSlot?.id === slot.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            {slot.time}
                        </button>
                    )) : (
                        <div className="col-span-full text-center p-6 bg-slate-50 rounded-xl text-slate-500">
                            No available slots for this department today.
                        </div>
                    )}
                </div>
            </div>

            {/* Action Footer */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-slate-600 text-center sm:text-left">
                    {selectedSlot ? (
                        <p>Selected: <strong className="text-slate-900">Today</strong> at <strong className="text-slate-900">{selectedSlot.time}</strong></p>
                    ) : (
                        <p>Please select a time to continue.</p>
                    )}
                </div>
                <button
                    onClick={handleBookSlot}
                    disabled={!selectedSlot || !patientName.trim()}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${selectedSlot && patientName.trim()
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
