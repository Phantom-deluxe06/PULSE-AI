import { FileText, Calendar, Stethoscope, ChevronDown, ChevronUp, Clock, Activity } from 'lucide-react';
import { useState } from 'react';

export default function MedicalRecordsView({ triageHistory }) {
    const [expandedId, setExpandedId] = useState(null);

    const getUrgencyColor = (level) => {
        if (level >= 4) return 'bg-red-100 text-red-700 border-red-200';
        if (level === 3) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const mockRecords = [
        { id: 'r1', type: 'Lab Report', date: 'Feb 20, 2026', doctor: 'Dr. Priya Sharma', department: 'Cardiology', summary: 'ECG results normal. Cholesterol slightly elevated. Follow-up recommended in 3 months.', status: 'Completed' },
        { id: 'r2', type: 'Consultation', date: 'Feb 15, 2026', doctor: 'Dr. Ananya Gupta', department: 'General Medicine', summary: 'Viral fever diagnosed. Prescribed Paracetamol and rest for 5 days. Symptoms resolved.', status: 'Completed' },
        { id: 'r3', type: 'Prescription', date: 'Feb 10, 2026', doctor: 'Dr. Sneha Reddy', department: 'Dermatology', summary: 'Prescribed topical cream for eczema. Monitor for improvement over 2 weeks.', status: 'Active' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-8 px-4">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
                    Medical Records
                </h2>
                <p className="text-slate-500 mt-1">View your past consultations, lab reports, and AI triage history.</p>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-blue-600" /> Consultation Records</h3>
                <div className="space-y-3">
                    {mockRecords.map((record) => (
                        <div key={record.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <button onClick={() => setExpandedId(expandedId === record.id ? null : record.id)} className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-blue-600" /></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-bold text-slate-900">{record.type}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${record.status === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{record.status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{record.doctor} • {record.department}</p>
                                </div>
                                <div className="text-right shrink-0 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 hidden sm:block">{record.date}</span>
                                    {expandedId === record.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </div>
                            </button>
                            {expandedId === record.id && (
                                <div className="px-5 pb-5 pt-0 animate-in fade-in duration-200">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mb-2"><Calendar className="w-3 h-3" /> {record.date}</div>
                                        <p className="text-sm text-slate-700 leading-relaxed">{record.summary}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> AI Triage History</h3>
                {(!triageHistory || triageHistory.length === 0) ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <Activity className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 font-medium">No triage history yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {triageHistory.map((entry, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <button onClick={() => setExpandedId(expandedId === `t${i}` ? null : `t${i}`)} className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><Stethoscope className="w-5 h-5 text-indigo-600" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate">{entry.symptoms?.slice(0, 60)}...</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-semibold text-blue-600">{entry.department}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getUrgencyColor(entry.urgency)}`}>P{entry.urgency}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2">
                                        <span className="text-xs text-slate-400 hidden sm:block">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                        {expandedId === `t${i}` ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                    </div>
                                </button>
                                {expandedId === `t${i}` && (
                                    <div className="px-5 pb-5 pt-0 animate-in fade-in duration-200 space-y-3">
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="text-xs font-bold text-slate-500 mb-1">Summary</p><p className="text-sm text-slate-700">{entry.summary}</p></div>
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100"><p className="text-xs font-bold text-slate-500 mb-1">Recommendation</p><p className="text-sm text-slate-700">{entry.recommendation}</p></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
