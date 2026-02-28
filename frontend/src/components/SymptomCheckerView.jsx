import { useState } from 'react';
import { HeartPulse, Send, Loader2, AlertTriangle, CheckCircle2, UserSearch, ArrowRight, Stethoscope } from 'lucide-react';
import EmergencyAlert from './EmergencyAlert';

export default function SymptomCheckerView({ setCurrentView, analyzeSymptomsFn, setFilterDepartment }) {
    const [symptoms, setSymptoms] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showEmergency, setShowEmergency] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;
        setIsLoading(true); setError(null); setResult(null); setShowEmergency(false);
        try {
            const res = await analyzeSymptomsFn(symptoms);
            setResult(res);
            if (res.urgency === 5) setShowEmergency(true); // trigger SOS alert
        } catch (err) {
            setError(err.message || 'Failed to analyze symptoms.');
        } finally { setIsLoading(false); }
    };

    const getUrgencyInfo = (level) => {
        if (level >= 4) return { color: 'bg-red-100 text-red-700 border-red-200', label: 'High Priority', icon: '🔴' };
        if (level === 3) return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Moderate', icon: '🟡' };
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Low Priority', icon: '🟢' };
    };

    const handleViewDoctors = () => {
        if (result?.department) setFilterDepartment(result.department);
        setCurrentView('find-doctor');
    };

    const examples = [
        "I have a sharp pain in my lower back and a slight fever.",
        "Persistent headache for 3 days with blurred vision.",
        "My child has a cough and runny nose for a week.",
        "Chest tightness and shortness of breath during exercise.",
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-8 px-4 pb-24 lg:pb-8">

            {/* Full-screen SOS Emergency Modal for Urgency 5 */}
            {showEmergency && result && (
                <EmergencyAlert
                    triageResult={result}
                    onProceedToBooking={() => { setShowEmergency(false); setCurrentView('booking'); }}
                    onDismiss={() => { setShowEmergency(false); setResult(null); setSymptoms(''); }}
                />
            )}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-primary" />
                    </div>
                    AI Symptom Checker
                </h2>
                <p className="text-slate-500 mt-2">Describe your symptoms in plain language. Our AI will recommend the right specialist.</p>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 mb-6">
                <div className="relative">
                    <Stethoscope className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Tell us how you're feeling..." rows="4" className="input w-full pl-12 pr-4 py-3 resize-none text-base" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold text-slate-400">Try:</span>
                    {examples.map((ex, i) => (
                        <button key={i} type="button" onClick={() => setSymptoms(ex)} className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors truncate max-w-[200px]">
                            {ex.slice(0, 40)}...
                        </button>
                    ))}
                </div>
                <button type="submit" disabled={!symptoms.trim() || isLoading} className={`mt-4 w-full sm:w-auto btn-primary flex items-center justify-center gap-2 ${symptoms.trim() && !isLoading ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`}>
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Send className="w-4 h-4" /> Check Symptoms</>}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3 animate-in fade-in">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div><p className="font-bold text-red-800 text-sm">Analysis Failed</p><p className="text-red-600 text-sm mt-1">{error}</p></div>
                </div>
            )}

            {result && (
                <div className="card !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-primary p-6 text-white">
                        <div className="flex items-center gap-3 mb-2"><CheckCircle2 className="w-6 h-6" /><h3 className="text-xl font-bold">AI Triage Result</h3></div>
                        <p className="text-primary-foreground/80 text-sm">Based on your symptoms, we recommend the following specialization.</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">🏥 {result.department}</span>
                            <span className={`px-4 py-2 rounded-xl font-bold text-sm border ${getUrgencyInfo(result.urgency).color}`}>{getUrgencyInfo(result.urgency).icon} Urgency: {result.urgency}/5 — {getUrgencyInfo(result.urgency).label}</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="font-bold text-slate-800 text-sm mb-1">Summary</p><p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p></div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="font-bold text-slate-800 text-sm mb-1">Recommendation</p><p className="text-slate-600 text-sm leading-relaxed">{result.recommendation}</p></div>

                        {result.tips && result.tips.length > 0 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                <p className="font-bold text-primary text-sm mb-2 flex items-center gap-1">
                                    <span className="text-primary">✨</span> Home Remedies & General Tips
                                </p>
                                <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-700 leading-relaxed">
                                    {result.tips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button onClick={handleViewDoctors} className="w-full btn-primary group flex items-center justify-center gap-2">
                            <UserSearch className="w-5 h-5" /> View Recommended Doctors <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
