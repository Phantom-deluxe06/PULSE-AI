import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight, ArrowLeft, Video, Building2, CheckCircle2 } from 'lucide-react';

export default function SlideThreePrefs({ setCurrentView, updateTriageState, initialData, onSubmitTriage }) {
    const [formData, setFormData] = useState({
        preferredDate: '',
        preferredTime: '',
        visitMode: 'in-person', // 'in-person' or 'video'
        visitedDeptBefore: false,
        consent: false,
        ...initialData
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleVisitMode = (mode) => {
        setFormData(prev => ({ ...prev, visitMode: mode }));
    };

    const handlePrevHistory = (visited) => {
        setFormData(prev => ({ ...prev, visitedDeptBefore: visited }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        updateTriageState('slideThree', formData);
        // Submit the fully compiled state to be processed by Gemini API
        onSubmitTriage(formData);
    };

    const isFormValid = formData.preferredDate && formData.preferredTime && formData.consent;

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto py-8 px-4 sm:px-6">

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header Ribbon */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Preferences</h2>
                        <p className="text-blue-100 font-medium">How and when would you like your consultation?</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shrink-0">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                </div>

                <form onSubmit={handleNext} className="p-8 sm:p-10 space-y-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Preferred Date */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Preferred Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Preferred Time Window */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Preferred Time</label>
                            <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select a window</option>
                                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                            </select>
                        </div>
                    </div>

                    {/* Mode of Visit */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">Mode of Visit</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => handleVisitMode('in-person')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold border-2 transition-all ${formData.visitMode === 'in-person'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                    }`}
                            >
                                <Building2 className={`w-5 h-5 ${formData.visitMode === 'in-person' ? 'text-blue-600' : 'text-slate-400'}`} />
                                In-Person
                            </button>
                            <button
                                type="button"
                                onClick={() => handleVisitMode('video')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold border-2 transition-all ${formData.visitMode === 'video'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                    }`}
                            >
                                <Video className={`w-5 h-5 ${formData.visitMode === 'video' ? 'text-blue-600' : 'text-slate-400'}`} />
                                Video Consultation
                            </button>
                        </div>
                    </div>

                    {/* Previous History Toggle */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-3">Have you visited this department before?</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handlePrevHistory(true)}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-all ${formData.visitedDeptBefore === true
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePrevHistory(false)}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-all ${formData.visitedDeptBefore === false
                                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                No, this is my first time
                            </button>
                        </div>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="checkbox"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleChange}
                                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    required
                                />
                                <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 select-none group-hover:text-slate-900 transition-colors">
                                I agree to share my health data for consultation purposes and understand that this tool does not replace emergency medical attention.
                            </span>
                        </label>
                    </div>

                    {/* Progress & Actions */}
                    <div className="pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                <div className="w-10 h-1.5 rounded-full bg-blue-600"></div>
                                <div className="w-10 h-1.5 rounded-full bg-blue-600"></div>
                                <div className="w-10 h-1.5 rounded-full bg-blue-600"></div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Step</span>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-4 items-center justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    updateTriageState('slideThree', formData);
                                    setCurrentView('slide-two');
                                }}
                                className="w-full sm:w-auto px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center"
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back
                            </button>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full sm:w-auto group relative px-8 py-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${isFormValid
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98]'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center">
                                    Submit to AI Triage <HeartPulse className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                                </span>
                                {isFormValid && (
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl border border-transparent"></div>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
