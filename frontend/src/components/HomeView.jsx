import { useEffect, useState } from 'react';
import {
    ArrowRight, LogIn, UserPlus, Activity, Stethoscope, Clock, Shield,
    HeartPulse, Brain, Bone, Baby, FlaskConical, ChevronDown,
    Star, CheckCircle2, Zap, MessageCircle, CalendarCheck2, ClipboardCheck
} from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';

/* ─── Data ─────────────────────────────────────────── */
const STATS = [
    { value: 12847, label: 'Patients Served', suffix: '+' },
    { value: 5, label: 'Specialties', suffix: '' },
    { value: 98, label: 'Satisfaction Rate', suffix: '%' },
    { value: 24, label: 'Hours Available', suffix: '/7' },
];

const SERVICES = [
    { icon: HeartPulse, title: 'Cardiology', desc: 'Heart & vascular care with AI-guided triage routing and priority booking.', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    { icon: Brain, title: 'Neurology', desc: 'Brain & nervous system disorders assessed and directed in under 30 seconds.', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
    { icon: Bone, title: 'Orthopedics', desc: 'Musculoskeletal care from fractures to chronic joint conditions.', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: Baby, title: 'Pediatrics', desc: 'Specialist child care with age-adjusted AI symptom assessment.', color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100' },
    { icon: FlaskConical, title: 'General Medicine', desc: 'Comprehensive care for all conditions — your first stop for any concern.', color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-100' },
    { icon: Stethoscope, title: 'Emergency Triage', desc: 'Urgent-case routing with immediate priority-5 escalation paths.', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Describe Symptoms', desc: 'Type or speak your symptoms in plain language. No medical jargon required.', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { step: '02', title: 'AI Assessment', desc: 'Gemini 2.5 Flash analyzes urgency level (1–5) and routes to the right specialty.', icon: Brain, color: 'text-violet-500', bg: 'bg-violet-50' },
    { step: '03', title: 'Instant Booking', desc: 'Pick a confirmed slot with a specialist — no phone calls, no waiting rooms.', icon: CalendarCheck2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { step: '04', title: 'Arrive Ready', desc: 'Your triage summary is shared with your doctor before you even walk in.', icon: ClipboardCheck, color: 'text-teal-500', bg: 'bg-teal-50' },
];

const TESTIMONIALS = [
    { name: 'Priya R.', role: 'Patient', text: 'I described my chest pain at 2 AM and was booked into Cardiology by 2:03 AM. Absolutely remarkable.', stars: 5 },
    { name: 'Dr. Amrit K.', role: 'Cardiologist', text: 'The pre-arrival triage summaries let me prepare before patients arrive. It genuinely saves lives.', stars: 5 },
    { name: 'Rajan M.', role: 'Parent', text: 'My son had a fever at night. PULSE AI told me to go to Pediatrics immediately — it was the right call.', stars: 5 },
];

/* ─── Animated Counter ──────────────────────────────── */
function AnimatedCounter({ target, suffix }) {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useScrollReveal();

    useEffect(() => {
        if (!isVisible) return;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, duration / steps);
        return () => clearInterval(timer);
    }, [isVisible, target]);

    return (
        <span ref={ref}>
            {isVisible ? count.toLocaleString() : '0'}{suffix}
        </span>
    );
}

/* ─── Reveal Wrapper ─────────────────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const [ref, isVisible] = useScrollReveal();
    const base = 'transition-all duration-700';
    const hidden = {
        up: 'opacity-0 translate-y-12',
        left: 'opacity-0 -translate-x-12',
        right: 'opacity-0 translate-x-12',
        fade: 'opacity-0',
    }[direction] || 'opacity-0 translate-y-12';

    return (
        <div
            ref={ref}
            className={`${base} ${className} ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : hidden}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────── */
export default function HomeView({ setCurrentView }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    const scrollToNext = () => {
        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col w-full bg-white overflow-x-hidden">

            {/* ═══════════════════════════════════════════
                SECTION 1 — HERO
            ═══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white px-4">

                {/* Grid texture overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Radial glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-[120px]" />
                </div>

                {/* Hero content */}
                <div className={`relative text-center max-w-5xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-light text-sm font-medium mb-8 backdrop-blur-sm">
                        <Activity className="w-4 h-4 animate-pulse text-primary" />
                        Powered by Gemini 2.5 Flash · AI-First Healthcare
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
                        <span className="block text-white">Healthcare,</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                            Reimagined.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        PULSE AI understands your symptoms in plain language, assesses urgency in seconds,
                        and connects you with the right specialist — day or night.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setCurrentView('signup')}
                            className="group px-8 py-4 rounded-full bg-primary hover:bg-opacity-90 text-white font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Get Started Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setCurrentView('login')}
                            className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold backdrop-blur-sm hover:bg-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Scroll chevron */}
                <button
                    onClick={scrollToNext}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 hover:text-white transition-colors animate-bounce"
                    aria-label="Scroll to services"
                >
                    <ChevronDown className="w-8 h-8" />
                </button>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 2 — STATS
            ═══════════════════════════════════════════ */}
            <section className="bg-white border-b border-slate-100 py-16 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((s, i) => (
                        <Reveal key={s.label} delay={i * 100} direction="up">
                            <div className="text-center">
                                <p className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">
                                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                                </p>
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest mt-2">{s.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 3 — SERVICES
            ═══════════════════════════════════════════ */}
            <section id="services-section" className="bg-slate-50 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">Our Specialties</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">World-Class Care,<br />For Every Condition</h2>
                            <p className="text-slate-500 mt-4 max-w-xl mx-auto">AI-powered triage routes you to the exact specialist your condition requires — instantly.</p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <Reveal key={s.title} delay={i * 80} direction="up">
                                    <div className={`group bg-white border ${s.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-default h-full`}>
                                        <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-6 h-6 ${s.color}`} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 4 — HOW IT WORKS (Timeline)
            ═══════════════════════════════════════════ */}
            <section className="bg-white py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <Reveal direction="up">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 block">How It Works</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">From Symptom to Doctor<br />in Under 3 Minutes</h2>
                        </div>
                    </Reveal>

                    <div className="relative">
                        {/* Vertical connector line */}
                        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-cyan-200 to-transparent hidden sm:block" />

                        <div className="flex flex-col gap-12">
                            {HOW_IT_WORKS.map((step, i) => {
                                const isEven = i % 2 === 0;
                                return (
                                    <Reveal key={step.step} delay={i * 150} direction={isEven ? 'left' : 'right'}>
                                        <div className={`flex gap-6 sm:gap-10 items-center ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                                            {/* Content */}
                                            <div className={`flex-1 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                                                <span className="text-5xl font-black text-slate-100 block leading-none mb-1">{step.step}</span>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                                            </div>
                                            {/* Icon node */}
                                            <div className={`shrink-0 w-16 h-16 rounded-2xl ${step.bg} border-2 border-white flex items-center justify-center shadow-sm z-10`}>
                                                {(() => { const Icon = step.icon; return <Icon className={`w-7 h-7 ${step.color}`} />; })()}
                                            </div>
                                            {/* Spacer on right */}
                                            <div className="flex-1 hidden sm:block" />
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 5 — TRUST BANNER
            ═══════════════════════════════════════════ */}
            <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white text-center">
                        {[
                            { icon: Shield, label: 'HIPAA Compliant', sub: 'Your data is fully protected' },
                            { icon: Zap, label: 'Instant Triage', sub: 'Assessed in under 30 seconds' },
                            { icon: CheckCircle2, label: 'Doctor Verified', sub: 'AI backed by clinical review' },
                        ].map((t, i) => {
                            const Icon = t.icon;
                            return (
                                <Reveal key={t.label} delay={i * 100} direction="up">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="font-bold text-lg">{t.label}</p>
                                        <p className="text-blue-100 text-sm">{t.sub}</p>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 6 — TESTIMONIALS
            ═══════════════════════════════════════════ */}
            <section className="bg-slate-50 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 block">Patient Stories</span>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">Real People.<br />Real Results.</h2>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <Reveal key={t.name} delay={i * 100} direction="up">
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col">
                                    <div className="flex gap-0.5 mb-4">
                                        {Array(t.stars).fill(0).map((_, j) => (
                                            <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-slate-400">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════
                SECTION 7 — FINAL CTA
            ═══════════════════════════════════════════ */}
            <section className="bg-slate-900 py-24 px-4 text-center">
                <Reveal direction="up">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <HeartPulse className="w-7 h-7 text-blue-400" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">Your Health,<br />Can't Wait.</h2>
                        <p className="text-slate-400 mb-10 text-lg">Join thousands who get expert medical routing in seconds — not hours.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setCurrentView('signup')}
                                className="group px-8 py-4 rounded-full bg-primary hover:bg-opacity-90 text-white font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
                            >
                                <UserPlus className="w-5 h-5" />
                                Create Free Account
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setCurrentView('login')}
                                className="px-8 py-4 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </button>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 py-8 px-4 text-center text-slate-600 text-sm">
                <p>© 2026 PULSE AI · AI-powered healthcare triage · Not a substitute for emergency services</p>
            </footer>
        </div>
    );
}
