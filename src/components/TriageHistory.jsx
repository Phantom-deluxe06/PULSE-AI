import { Clock, Brain, Building2, AlertTriangle, Trash2 } from 'lucide-react';

const getUrgencyBadge = (level) => {
    if (level <= 2) return { label: 'Low', color: 'bg-emerald-100 text-emerald-700' };
    if (level === 3) return { label: 'Moderate', color: 'bg-amber-100 text-amber-700' };
    if (level === 4) return { label: 'High', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Critical', color: 'bg-red-100 text-red-700' };
};

export default function TriageHistory({ history, onClearHistory, setCurrentView }) {
    if (!history || history.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Triage History</h2>
                <p className="text-slate-500 mb-6">Your past AI assessments will appear here after you assess symptoms.</p>
                <button
                    onClick={() => setCurrentView('query')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    Start Triage
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Triage History</h2>
                    <p className="text-slate-500 text-sm mt-1">{history.length} past assessment{history.length > 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={onClearHistory}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition"
                >
                    <Trash2 className="w-4 h-4" /> Clear All
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {history.map((item, index) => {
                    const badge = getUrgencyBadge(item.urgency);
                    return (
                        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-500" />
                                    <span className="font-bold text-slate-900">{item.department}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">Symptoms</p>
                                <p className="text-sm text-slate-700">{item.symptoms}</p>
                            </div>

                            <p className="text-sm text-slate-600 mb-1">
                                <span className="font-semibold text-slate-500">Assessment:</span> {item.summary}
                            </p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                {item.recommendation}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
