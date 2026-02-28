import { useState } from 'react';
import { User, Mail, Phone, Save, ArrowLeft, CheckCircle2, Camera } from 'lucide-react';

const STORAGE_USER = 'pulse_ai_user';

export default function ProfileView({ currentUser, setCurrentUser, setCurrentView }) {
    const [form, setForm] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        age: currentUser?.age || '',
        gender: currentUser?.gender || '',
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const updatedUser = { ...currentUser, ...form };
        localStorage.setItem(STORAGE_USER, JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = form.name
        ? form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'P';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-8 px-4">
            <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white relative">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                            {initials}
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold">{form.name || 'Your Profile'}</h2>
                            <p className="text-white/80 text-sm mt-1">{form.email}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="p-8 space-y-6">
                    {saved && (
                        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-300">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-emerald-700">Profile updated successfully!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="(555) 123-4567"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Age</label>
                            <input
                                type="number"
                                name="age"
                                min="0"
                                max="120"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="Years"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Gender */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-2">Gender</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
