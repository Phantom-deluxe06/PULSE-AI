import { useState, useRef, useEffect } from 'react';
import { FileUp, MessageSquare, HeartPulse, ArrowRight, ArrowLeft, Mic, MicOff } from 'lucide-react';

export default function SlideTwoQuery({ setCurrentView, updateTriageState, initialData }) {
    const [formData, setFormData] = useState({
        department: 'Unsure',
        queryType: 'Symptom check',
        severity: 5,
        symptoms: '',
        ...initialData // Prefill if navigating back
    });

    // Voice input state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setFormData(prev => ({
                    ...prev,
                    symptoms: prev.symptoms ? `${prev.symptoms} ${transcript}` : transcript
                }));
                setIsListening(false);
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) {
            alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        updateTriageState('slideTwo', formData);
        setCurrentView('slide-three');
    };

    const isFormValid = formData.symptoms.trim().length > 10;

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto py-8 px-4 sm:px-6">

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header Ribbon */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Query Details</h2>
                        <p className="text-blue-100 font-medium">Tell us what you're experiencing.</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shrink-0">
                        <HeartPulse className="w-8 h-8 text-white" />
                    </div>
                </div>

                <form onSubmit={handleNext} className="p-8 sm:p-10 space-y-8">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Department */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Department (Optional)</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="Unsure">Not sure / General</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="General Medicine">General Medicine</option>
                            </select>
                        </div>

                        {/* Query Type */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Query Type</label>
                            <select
                                name="queryType"
                                value={formData.queryType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="Symptom check">Symptom check</option>
                                <option value="Prescription renewal">Prescription renewal</option>
                                <option value="Lab report follow-up">Lab report follow-up</option>
                                <option value="Post-surgery checkup">Post-surgery checkup</option>
                                <option value="Routine checkup">Routine checkup</option>
                            </select>
                        </div>
                    </div>

                    {/* Severity Slider */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                            <label className="block text-sm font-bold text-slate-900">How urgent is your concern?</label>
                            <span className={`text-lg font-black ${formData.severity >= 8 ? 'text-red-600' :
                                formData.severity >= 5 ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                {formData.severity} / 10
                            </span>
                        </div>
                        <input
                            type="range"
                            name="severity"
                            min="1"
                            max="10"
                            value={formData.severity}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                        </div>
                    </div>

                    {/* Message Box with Voice Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Symptom Details</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                placeholder="Please describe your symptoms, how long you've had them, and any previous treatments..."
                                rows="4"
                                className={`w-full pl-12 pr-14 py-3 rounded-xl border ${isListening ? 'border-red-400 ring-2 ring-red-300' : 'border-slate-200'} bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                required
                            />
                            {/* Mic Button */}
                            <button
                                type="button"
                                onClick={toggleVoice}
                                title="Click to speak your symptoms"
                                className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600'
                                    }`}
                            >
                                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                        </div>
                        {isListening && (
                            <p className="text-center text-red-500 text-sm font-medium animate-pulse mt-2">🎙 Listening... Speak your symptoms</p>
                        )}
                    </div>

                    {/* File Upload Mock */}
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Previous Records</label>
                        <button
                            type="button"
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-col items-center justify-center gap-2 group"
                            onClick={() => alert("File upload modal would open here.")}
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <FileUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-700">Upload Previous Reports (PDF/JPG)</span>
                            <span className="text-xs text-slate-400">Optional: helps doctors understand your history</span>
                        </button>
                    </div>

                    {/* Progress & Actions */}
                    <div className="pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                <div className="w-10 h-1.5 rounded-full bg-blue-600"></div>
                                <div className="w-10 h-1.5 rounded-full bg-blue-600"></div>
                                <div className="w-10 h-1.5 rounded-full bg-slate-200"></div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2 of 3</span>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-4 items-center justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    updateTriageState('slideTwo', formData);
                                    setCurrentView('patient-details');
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
                                    Continue to Preferences <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
