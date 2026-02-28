import { useState, useEffect } from 'react';
import { User, Phone, CalendarHeart, ArrowRight, Activity, Info, ShieldCheck } from 'lucide-react';
import { savePatientDetails, getPatientDetails, getCurrentUser } from '../utils/auth';

export default function PatientDetailsView({ setCurrentView, updateTriageState, initialData }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        age: '',
        gender: '',
        returningPatient: null, // null, 'yes', 'no'
        patientId: '',
        ...initialData
    });

    const [errors, setErrors] = useState({});

    // Load saved patient details on mount
    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            const saved = getPatientDetails(user.id);
            if (saved) {
                setFormData(prev => ({ ...prev, ...saved, returningPatient: 'yes' }));
            }
        }
    }, []);

    const formatPhoneNumber = (value) => {
        // Strip all non-digits
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    };

    const validatePhone = (phone) => {
        const rawDigits = phone.replace(/[^\d]/g, '');
        return rawDigits.length === 10;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, phone: formatted }));
            if (errors.phone && validatePhone(formatted)) {
                setErrors(prev => ({ ...prev, phone: null }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleReturningStatus = (status) => {
        setFormData(prev => ({ ...prev, returningPatient: status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final Validation
        const newErrors = {};
        if (!validatePhone(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Save patient details for next time
        const user = getCurrentUser();
        if (user) {
            savePatientDetails(user.id, formData);
        }
        updateTriageState('slideOne', formData);
        setCurrentView('slide-two');
    };

    const isFormValid =
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.age !== '' &&
        formData.gender !== '' &&
        formData.returningPatient !== null &&
        (formData.returningPatient === 'no' || (formData.returningPatient === 'yes' && formData.patientId !== ''))
        ;

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto py-8 px-4 sm:px-6 pb-24 lg:pb-8">

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Header Ribbon */}
                <div className="bg-primary p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Patient Details</h2>
                        <p className="text-white/80 font-medium">Let's get to know you before we assess your symptoms.</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 sm:p-10">

                    <div className="space-y-8">
                        {/* Returning Patient Question */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Have you visited this facility before?</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleReturningStatus('yes')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold border-2 transition-all ${formData.returningPatient === 'yes'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50'
                                        }`}
                                >
                                    Yes, I'm returning
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleReturningStatus('no')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold border-2 transition-all ${formData.returningPatient === 'no'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50'
                                        }`}
                                >
                                    No, I'm a new patient
                                </button>
                            </div>
                        </div>

                        {/* Optional Patient ID Field (Animated entry) */}
                        {formData.returningPatient === 'yes' && (
                            <div className="animate-in slide-in-from-top-4 fade-in duration-300 p-5 bg-secondary/10 rounded-2xl border border-secondary/30">
                                <label className="block text-sm font-bold text-slate-900 mb-2">Patient ID or Previous Booking Reference (Optional)</label>
                                <div className="relative">
                                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                    <input
                                        type="text"
                                        name="patientId"
                                        value={formData.patientId}
                                        onChange={handleChange}
                                        placeholder="e.g. PAT-12345"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(555) 123-4567"
                                        maxLength="14"
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Age & Gender Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        min="0"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Years"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Informational Note */}
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <Info className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Your personal details are encrypted and stored in compliance with standard privacy regulations. This information is strictly used to match you with the appropriate medical specialist.
                            </p>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setCurrentView('home')}
                                className="w-full sm:w-auto px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full sm:w-auto group relative px-8 py-3.5 rounded-xl font-bold flex items-center justify-center transition-all ${isFormValid
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center">
                                    Continue to Symptoms <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>

                    </div>
                </form>
            </div>

        </div>
    );
}
