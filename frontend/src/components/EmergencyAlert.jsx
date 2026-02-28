import { useEffect } from 'react';
import { Phone, ShieldAlert, AlertTriangle } from 'lucide-react';

/**
 * Plays an SOS beep pattern (... --- ...) using the Web Audio API.
 * Each dot = 100ms beep, dash = 300ms beep, gaps between symbols.
 */
function playSOSBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const DOT = 0.1;
        const DASH = 0.3;
        const GAP = 0.08;
        const LETTER_GAP = 0.25;
        const FREQ = 880;

        // SOS: ... --- ...
        const pattern = [
            DOT, GAP, DOT, GAP, DOT,                          // S
            LETTER_GAP,
            DASH, GAP, DASH, GAP, DASH,                        // O
            LETTER_GAP,
            DOT, GAP, DOT, GAP, DOT,                           // S
        ];

        let t = ctx.currentTime + 0.1;
        let i = 0;

        function scheduleNext() {
            if (i >= pattern.length) return;
            const duration = pattern[i];
            if (duration >= DOT) { // it's a beep (not a gap separator)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(FREQ, t);
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.4, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
                osc.start(t);
                osc.stop(t + duration);
                t += duration + 0.05;
            } else {
                t += duration; // gap
            }
            i++;
            scheduleNext();
        }
        scheduleNext();

        // Repeat SOS twice total
        setTimeout(() => {
            playSOSBeep._once && playSOSBeep._once();
        }, 3000);
    } catch {
        // AudioContext not supported — fail silently
    }
}

export default function EmergencyAlert({ triageResult, onProceedToBooking, onDismiss }) {
    useEffect(() => {
        // Play SOS beep twice on mount
        playSOSBeep();
        const t = setTimeout(playSOSBeep, 3200);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="max-w-lg w-full mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl">

                {/* Flashing Red Banner */}
                <div className="bg-red-600 px-8 py-6 text-white text-center" style={{ animation: 'sos-flash 0.8s ease-in-out infinite' }}>
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-ping absolute" />
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center relative z-10">
                            <ShieldAlert className="w-9 h-9 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-black tracking-[0.4em] text-red-200 mb-1">⚠ SOS ⚠</p>
                    <h2 className="text-3xl font-black tracking-tight">Emergency Alert</h2>
                    <p className="text-red-100 mt-1 text-sm font-medium">Urgency Level 5 — Critical Condition Detected</p>
                </div>

                {/* Body */}
                <div className="px-8 py-6 text-center">
                    <p className="text-slate-700 text-base font-medium mb-2">
                        Based on your symptoms, our AI has detected a <strong className="text-red-600">potentially life-threatening condition</strong>.
                    </p>
                    <p className="text-slate-600 text-sm mb-1">
                        <span className="font-semibold">AI Assessment:</span> {triageResult?.summary}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                        This is not a substitute for professional medical advice. If you are in immediate danger, call emergency services right away.
                    </p>
                </div>

                {/* Emergency Call Button */}
                <div className="px-8 pb-4">
                    <a
                        href="tel:108"
                        className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/40"
                    >
                        <Phone className="w-6 h-6" /> Call Emergency (108)
                    </a>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 px-8">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-xs text-slate-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Soft Actions */}
                <div className="px-8 py-4 flex gap-3">
                    <button
                        onClick={onDismiss}
                        className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
                    >
                        Re-assess
                    </button>
                    <button
                        onClick={onProceedToBooking}
                        className="flex-1 py-3 rounded-xl font-semibold text-sm bg-slate-800 text-white hover:bg-slate-900 transition flex items-center justify-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" /> Book Urgent Slot
                    </button>
                </div>
            </div>

            {/* SOS flash keyframe injected inline */}
            <style>{`
                @keyframes sos-flash {
                    0%, 100% { background-color: rgb(220 38 38); }
                    50% { background-color: rgb(185 28 28); }
                }
            `}</style>
        </div>
    );
}
