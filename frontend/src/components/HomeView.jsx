import { ArrowRight, Shield, Clock, Stethoscope, LogIn, UserPlus } from 'lucide-react';

export default function HomeView({ setCurrentView }) {
    return (
        <div className="flex flex-col animate-in fade-in duration-500 w-full h-full pb-16">
            <div className="flex-1 flex flex-col items-center justify-center text-center pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8">

                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 mb-8 shadow-sm">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Powered by Gemini 2.5 Flash
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mx-auto max-w-4xl text-balance">
                    Smart Triage.<br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Instant Care.</span>
                </h2>

                <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                    Describe your symptoms in your own words. PULSE AI instantly assesses urgency and routes you to the correct specialist—eliminating guesswork and wait times.
                </p>

                {/* Auth Buttons */}
                <div className="mt-10 flex gap-4 flex-col sm:flex-row justify-center w-full sm:w-auto px-4 sm:px-0">
                    <button
                        onClick={() => setCurrentView('login')}
                        className="group relative px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center w-full sm:w-auto overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            <LogIn className="mr-2 w-5 h-5" /> Sign In
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <button
                        onClick={() => setCurrentView('signup')}
                        className="group px-8 py-3.5 rounded-full bg-white text-slate-700 font-semibold border-2 border-slate-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center w-full sm:w-auto"
                    >
                        <UserPlus className="mr-2 w-5 h-5" /> Create Account
                    </button>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 text-left px-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Plain Language</h3>
                        <p className="text-slate-600">No medical jargon needed. Just tell us how you feel, and our AI understands.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Booking</h3>
                        <p className="text-slate-600">Skip the phone queue. Get matched with available slots in the right department instantly.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Priority Routing</h3>
                        <p className="text-slate-600">Critical cases are automatically flagged and routed to immediate care paths.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
