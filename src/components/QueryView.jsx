import React from 'react';
import { Loader2, Heart, Brain, Bone, Baby, Stethoscope, AlertTriangle, Calendar } from 'lucide-react';

const getDeptIcon = (dept) => {
    switch (dept) {
        case 'Cardiology': return <Heart className="w-5 h-5 text-red-500" />
        case 'Neurology': return <Brain className="w-5 h-5 text-purple-500" />
        case 'Orthopedics': return <Bone className="w-5 h-5 text-amber-500" />
        case 'Pediatrics': return <Baby className="w-5 h-5 text-blue-500" />
        default: return <Stethoscope className="w-5 h-5 text-teal-500" />
    }
}

const getUrgencyColor = (urgency) => {
    if (urgency <= 2) return 'bg-success text-white'
    if (urgency === 3) return 'bg-warning text-slate-dark'
    return 'bg-danger text-white'
}

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
    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 mt-8">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">How are you feeling today?</h2>

            {!triageResult ? (
                <form onSubmit={handleTriage} className="flex flex-col gap-4">
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="E.g., I've had a sharp pain in my chest since this morning and my left arm feels numb..."
                        className="w-full h-40 p-4 border border-slate-200 text-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                    />

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !symptoms.trim()}
                        className="bg-blue-600 text-white p-4 rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Symptoms...</>
                        ) : 'Assess My Symptoms'}
                    </button>
                </form>
            ) : (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
                            {getDeptIcon(triageResult.department)}
                            <span className="font-semibold text-slate-800 text-sm">{triageResult.department}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyColor(triageResult.urgency)}`}>
                            Urgency: Level {triageResult.urgency}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 text-lg mb-1">AI Assessment</h3>
                        <p className="text-slate-600">{triageResult.summary}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <h3 className="font-semibold text-slate-800 text-sm mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" /> Recommendation
                        </h3>
                        <p className="text-slate-600 text-sm">{triageResult.recommendation}</p>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => setTriageResult(null)}
                            className="flex-1 bg-white text-slate-600 border border-slate-200 p-3 rounded-xl font-medium hover:bg-slate-50 transition"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => setCurrentView('booking')}
                            className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
