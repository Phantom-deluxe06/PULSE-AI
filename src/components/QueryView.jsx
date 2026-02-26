import { useState, useRef, useEffect } from 'react';
import { Loader2, Mic, MicOff, AlertTriangle, Sparkles } from 'lucide-react';
import TriageSkeleton from './TriageSkeleton';

const QUICK_SYMPTOMS = [
    "Chest pain and shortness of breath",
    "Severe headache and dizziness",
    "High fever in a child (above 103°F)",
    "Back pain after a fall",
    "Persistent cough for 2+ weeks",
];

const getUrgencyLabel = (urgency) => {
    if (urgency <= 2) return { label: 'Low — Routine', color: 'bg-emerald-100 text-emerald-700' };
    if (urgency === 3) return { label: 'Moderate — Schedule Soon', color: 'bg-amber-100 text-amber-700' };
    if (urgency === 4) return { label: 'High — Urgent', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Critical — Emergency', color: 'bg-red-100 text-red-700' };
};

const getDeptColor = (dept) => {
    const map = {
        'Cardiology': 'text-red-500',
        'Neurology': 'text-purple-500',
        'Orthopedics': 'text-amber-500',
        'Pediatrics': 'text-blue-500',
        'General Medicine': 'text-teal-500',
    };
    return map[dept] || 'text-slate-500';
};

export default function QueryView({
    setCurrentView,
    symptoms,
    setSymptoms,
    isLoading,
    error,
    triageResult,
    setTriageResult,
    handleTriage
}) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Web Speech API setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);

            recognitionRef.current = recognition;
        }
    }, [setSymptoms]);

    const toggleVoice = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const urgencyInfo = triageResult ? getUrgencyLabel(triageResult.urgency) : null;

    // Show full-screen skeleton while AI is analyzing
    if (isLoading) return <TriageSkeleton />;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 pt-6 pb-12">

            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900">How are you feeling?</h2>
                <p className="text-slate-500 mt-1 text-sm">Describe your symptoms clearly. Our AI will route you to the right specialist.</p>
            </div>

            {!triageResult ? (
                <div className="flex flex-col gap-4">
                    {/* Quick Suggestions */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Common Symptoms</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_SYMPTOMS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSymptoms(s)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Symptom Input */}
                    <div className="relative">
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="E.g., I've had a sharp pain in my chest since this morning and my left arm feels numb..."
                            rows={5}
                            className={`w-full p-5 pr-14 border text-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none transition ${isListening ? 'border-red-400 ring-2 ring-red-300' : 'border-slate-200'}`}
                        />
                        {/* Voice Button */}
                        <button
                            type="button"
                            onClick={toggleVoice}
                            title={recognitionRef.current ? "Click to speak" : "Voice not supported in this browser"}
                            className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600'
                                }`}
                        >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                    </div>

                    {isListening && (
                        <p className="text-center text-red-500 text-sm font-medium animate-pulse">🎙 Listening... Speak your symptoms</p>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleTriage}
                        disabled={isLoading || !symptoms.trim()}
                        className="bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-base shadow-lg shadow-blue-500/30"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Symptoms...</>
                        ) : (
                            <><Sparkles className="w-5 h-5" /> Assess My Symptoms</>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        ⚠️ This tool is AI-assisted and not a substitute for professional medical advice.
                    </p>
                </div>
            ) : (
                /* Triage Result Card */
                <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

                    {/* Result Header */}
                    <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">AI Triage Result</p>
                            <h3 className={`text-2xl font-black ${getDeptColor(triageResult.department)}`}>
                                {triageResult.department}
                            </h3>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${urgencyInfo.color}`}>
                            {urgencyInfo.label}
                        </span>
                    </div>

                    {/* Summary */}
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Assessment</p>
                            <p className="text-slate-700 text-sm leading-relaxed">{triageResult.summary}</p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Recommendation
                            </p>
                            <p className="text-slate-600 text-sm">{triageResult.recommendation}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                        <button
                            onClick={() => setTriageResult(null)}
                            className="flex-1 bg-white text-slate-600 border border-slate-200 p-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                        >
                            Re-assess
                        </button>
                        <button
                            onClick={() => setCurrentView('booking')}
                            className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
                        >
                            Book Appointment →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
