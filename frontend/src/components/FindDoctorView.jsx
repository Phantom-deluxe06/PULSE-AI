import { useState } from 'react';
import { Search, MapPin, Star, Clock, Video, Building2, Calendar, ChevronDown, X, CheckCircle2, Users, Timer, MessageSquare, Send } from 'lucide-react';

const DOCTORS = [
    { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', hospital: 'City Hospital', rating: 4.9, reviews: 142, available: 'Today, 4:00 PM', fee: '₹800', type: 'both', img: '👩‍⚕️' },
    { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Orthopedic Surgeon', hospital: "St. Joseph's Clinic", rating: 4.7, reviews: 98, available: 'Tomorrow, 10:00 AM', fee: '₹1,200', type: 'in-person', img: '👨‍⚕️' },
    { id: 3, name: 'Dr. Fatima Khan', specialty: 'Pediatrician', hospital: 'Apollo Hospital', rating: 4.8, reviews: 215, available: 'Today, 6:30 PM', fee: '₹600', type: 'both', img: '👩‍⚕️' },
    { id: 4, name: 'Dr. Rajesh Iyer', specialty: 'Neurologist', hospital: 'City Hospital', rating: 4.6, reviews: 76, available: 'Wed, 11:00 AM', fee: '₹1,500', type: 'video', img: '👨‍⚕️' },
    { id: 5, name: 'Dr. Sneha Reddy', specialty: 'Dermatologist', hospital: 'MedPlus Clinic', rating: 4.9, reviews: 189, available: 'Today, 2:00 PM', fee: '₹700', type: 'both', img: '👩‍⚕️' },
    { id: 6, name: 'Dr. Vikram Singh', specialty: 'ENT Specialist', hospital: "St. Joseph's Clinic", rating: 4.5, reviews: 62, available: 'Thu, 9:00 AM', fee: '₹900', type: 'in-person', img: '👨‍⚕️' },
    { id: 7, name: 'Dr. Ananya Gupta', specialty: 'General Physician', hospital: 'Apollo Hospital', rating: 4.8, reviews: 310, available: 'Today, 5:00 PM', fee: '₹500', type: 'both', img: '👩‍⚕️' },
    { id: 8, name: 'Dr. Karthik Nair', specialty: 'Nephrologist', hospital: 'City Hospital', rating: 4.7, reviews: 88, available: 'Tomorrow, 3:00 PM', fee: '₹1,100', type: 'video', img: '👨‍⚕️' },
];

const HOSPITALS = ['All Hospitals', 'City Hospital', "St. Joseph's Clinic", 'Apollo Hospital', 'MedPlus Clinic'];
const DEPARTMENTS = ['All Departments', 'Cardiologist', 'Orthopedic Surgeon', 'Pediatrician', 'Neurologist', 'Dermatologist', 'ENT Specialist', 'General Physician', 'Nephrologist'];
const CONSULT_TYPES = ['All Types', 'In-Person', 'Video'];

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'];

function getLiveStatus(doctorId) {
    const baseToken = 8 + (doctorId * 3) % 12;
    const waiting = 1 + (doctorId * 7) % 8;
    const waitMins = waiting * 12 + (doctorId % 3) * 5;
    return {
        currentToken: baseToken,
        waitingCount: waiting,
        estimatedWait: waitMins,
    };
}

export default function FindDoctorView({ setCurrentView, filterDepartment, onBookAppointment }) {
    const [search, setSearch] = useState('');
    const [hospital, setHospital] = useState('All Hospitals');
    const [department, setDepartment] = useState(filterDepartment || 'All Departments');
    const [consultType, setConsultType] = useState('All Types');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booked, setBooked] = useState(false);
    const [activeTab, setActiveTab] = useState('book');
    const [queryText, setQueryText] = useState('');
    const [querySent, setQuerySent] = useState(false);

    const filtered = DOCTORS.filter(d => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
        const matchHospital = hospital === 'All Hospitals' || d.hospital === hospital;
        const matchDept = department === 'All Departments' || d.specialty === department;
        const matchType = consultType === 'All Types' || (consultType === 'Video' ? d.type === 'video' || d.type === 'both' : d.type === 'in-person' || d.type === 'both');
        return matchSearch && matchHospital && matchDept && matchType;
    });

    const handleBook = () => {
        if (onBookAppointment && selectedDoctor && selectedSlot) {
            onBookAppointment({
                doctorName: selectedDoctor.name,
                department: selectedDoctor.specialty,
                hospital: selectedDoctor.hospital,
                time: selectedSlot,
                date: new Date().toLocaleDateString(),
                fee: selectedDoctor.fee,
            });
        }
        setBooked(true);
        setTimeout(() => { setBooked(false); setSelectedDoctor(null); setSelectedSlot(null); }, 2500);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-8 px-4 pb-24 lg:pb-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">Find a Doctor</h2>
                <p className="text-slate-500 mt-1">Search, filter, and book appointments with specialists.</p>
            </div>

            <div className="card p-4 sm:p-6 mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by doctor name or specialty..." className="input w-full pl-12 pr-4 py-3" />
                </div>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: 'Hospital', value: hospital, options: HOSPITALS, setter: setHospital },
                        { label: 'Department', value: department, options: DEPARTMENTS, setter: setDepartment },
                        { label: 'Type', value: consultType, options: CONSULT_TYPES, setter: setConsultType },
                    ].map((filter) => (
                        <div key={filter.label} className="relative">
                            <select value={filter.value} onChange={(e) => filter.setter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                                {filter.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-sm font-semibold text-slate-400 mb-4">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((doc) => (
                    <div key={doc.id} className={`card !p-0 overflow-hidden transition-all hover:shadow-md cursor-pointer ${selectedDoctor?.id === doc.id ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100'}`} onClick={() => { setSelectedDoctor(doc); setSelectedSlot(null); setBooked(false); }}>
                        <div className="p-5 flex gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">{doc.img}</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-slate-900 truncate">{doc.name}</h4>
                                <p className="text-sm text-primary font-semibold">{doc.specialty}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doc.hospital}</span>
                                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {doc.rating} ({doc.reviews})</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-lg font-black text-slate-900">{doc.fee}</p>
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${doc.available.includes('Today') ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                                    <Clock className="w-3 h-3" /> {doc.available.includes('Today') ? 'Available Today' : doc.available.split(',')[0]}
                                </span>
                            </div>
                        </div>

                        {/* Live Status Bar */}
                        {(() => {
                            const status = getLiveStatus(doc.id);
                            return (
                                <div className="border-t border-slate-100 px-5 py-3 bg-gradient-to-r from-slate-50 to-primary/5 flex items-center gap-4 sm:gap-6 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Live</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        <span>Now attending: <strong className="text-slate-900">Token #{status.currentToken}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <Users className="w-3.5 h-3.5 text-amber-500" />
                                        <span><strong className="text-slate-900">{status.waitingCount}</strong> patient{status.waitingCount !== 1 ? 's' : ''} ahead</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <Timer className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Approx. <strong className="text-slate-900">{status.estimatedWait} mins</strong></span>
                                    </div>
                                </div>
                            );
                        })()}

                        {selectedDoctor?.id === doc.id && (
                            <div className="border-t border-slate-100 bg-slate-50 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
                                {/* Success states */}
                                {(booked || querySent) ? (
                                    <div className="text-center py-8 px-5">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-in zoom-in" />
                                        <p className="text-lg font-bold text-slate-900">{booked ? 'Appointment Booked!' : 'Query Submitted!'}</p>
                                        <p className="text-sm text-slate-500">{booked ? `with ${doc.name}` : `Your question has been sent to ${doc.name}`}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Tabs */}
                                        <div className="flex border-b border-slate-200">
                                            <button onClick={() => setActiveTab('book')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${activeTab === 'book' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                                                <Calendar className="w-4 h-4" /> Book Appointment
                                            </button>
                                            <button onClick={() => setActiveTab('query')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${activeTab === 'query' ? 'text-primary border-b-2 border-primary bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                                                <MessageSquare className="w-4 h-4" /> Ask a Question
                                            </button>
                                        </div>

                                        <div className="p-5">
                                            {activeTab === 'book' ? (
                                                /* --- Book Appointment Tab --- */
                                                <>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-sm font-bold text-slate-900">Select a time slot</p>
                                                        <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                                                        {TIME_SLOTS.map((slot, i) => {
                                                            const isBooked = i === 2 || i === 5;
                                                            const isPast = (() => {
                                                                const [timePart, modifier] = slot.split(' ');
                                                                let [hours, minutes] = timePart.split(':').map(Number);
                                                                if (modifier === 'PM' && hours < 12) hours += 12;
                                                                if (modifier === 'AM' && hours === 12) hours = 0;
                                                                const slotTime = new Date();
                                                                slotTime.setHours(hours, minutes, 0, 0);
                                                                return slotTime <= new Date();
                                                            })();
                                                            const isDisabled = isBooked || isPast;
                                                            return (
                                                                <button key={slot} disabled={isDisabled} onClick={() => setSelectedSlot(slot)} className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${isDisabled ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed line-through' : selectedSlot === slot ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-primary/30'}`}>
                                                                    {slot}{isPast && !isBooked ? ' (Passed)' : ''}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex gap-2 items-center text-xs text-slate-400">
                                                            <span className="w-3 h-3 bg-slate-100 rounded border border-slate-200 inline-block" /> Booked
                                                            <span className="w-3 h-3 bg-primary rounded inline-block ml-2" /> Selected
                                                        </div>
                                                        <button onClick={handleBook} disabled={!selectedSlot} className={`ml-auto px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedSlot ? 'bg-primary text-white shadow-sm hover:opacity-90 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                /* --- Submit Query Tab --- */
                                                <>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-sm font-bold text-slate-900">Send a question to {doc.name}</p>
                                                        <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mb-3">Describe your concern or question. The doctor will respond within 24 hours — no appointment needed.</p>
                                                    <textarea
                                                        value={queryText}
                                                        onChange={(e) => setQueryText(e.target.value)}
                                                        maxLength={500}
                                                        rows={4}
                                                        placeholder="e.g. I've been experiencing mild chest pain for the past 2 days. Should I be concerned?"
                                                        className="input w-full px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 resize-none"
                                                    />
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="text-xs text-slate-400">{queryText.length}/500 characters</span>
                                                        <button
                                                            onClick={() => { setQuerySent(true); setTimeout(() => { setQuerySent(false); setSelectedDoctor(null); setQueryText(''); }, 2500); }}
                                                            disabled={queryText.trim().length < 10}
                                                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${queryText.trim().length >= 10 ? 'bg-primary text-white shadow-sm hover:opacity-90 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                                        >
                                                            <Send className="w-4 h-4" /> Submit Query
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
