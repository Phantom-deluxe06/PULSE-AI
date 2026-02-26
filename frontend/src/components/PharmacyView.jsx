import { useState } from 'react';
import { Upload, Loader2, CheckCircle2, Pill, MapPin, Clock, Package, ChevronRight, Star, Navigation, ShoppingBag } from 'lucide-react';

const MOCK_MEDICINES = [
    { name: 'Paracetamol (500mg)', qty: '10 tabs', price: '₹25' },
    { name: 'Amoxicillin (250mg)', qty: '5 tabs', price: '₹85' },
    { name: 'Vitamin D3 (1000 IU)', qty: '30 capsules', price: '₹180' },
    { name: 'Omeprazole (20mg)', qty: '15 tabs', price: '₹60' },
];

const PHARMACIES = [
    { name: 'Apollo Pharmacy', branch: 'Teynampet', distance: '0.8 km', hours: 'Open 24/7', stock: true, rating: 4.5 },
    { name: 'MedPlus', branch: 'Anna Nagar', distance: '1.2 km', hours: 'Closes 10 PM', stock: true, rating: 4.3 },
    { name: 'City Hospital Pharmacy', branch: 'Main Campus', distance: '2.1 km', hours: 'Open 24/7', stock: true, rating: 4.7 },
    { name: 'Netmeds Store', branch: 'T. Nagar', distance: '3.5 km', hours: 'Closes 9 PM', stock: false, rating: 4.1 },
];

const CHAINS = ['Apollo Pharmacy', 'MedPlus', 'Hospital Pharmacy'];

export default function PharmacyView() {
    const [tab, setTab] = useState('upload');
    const [uploadState, setUploadState] = useState('idle');
    const [selectedMeds, setSelectedMeds] = useState([]);
    const [showPharmacy, setShowPharmacy] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([
        { id: 1, pharmacy: 'Apollo Pharmacy - Teynampet', meds: 'Paracetamol, Vitamin D3', status: 'Awaiting Doctor Approval', date: 'Feb 25, 2026' },
        { id: 2, pharmacy: 'MedPlus - Anna Nagar', meds: 'Amoxicillin', status: 'Sent to Pharmacy', date: 'Feb 24, 2026' },
    ]);

    const handleUpload = () => {
        setUploadState('processing');
        setTimeout(() => { setUploadState('done'); setSelectedMeds(MOCK_MEDICINES.map((_, i) => i)); }, 2500);
    };

    const toggleMed = (index) => setSelectedMeds(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    const selectAll = () => setSelectedMeds(MOCK_MEDICINES.map((_, i) => i));

    const handleRefill = () => {
        if (!selectedPharmacy) return;
        setPendingRequests(prev => [{ id: Date.now(), pharmacy: `${selectedPharmacy.name} - ${selectedPharmacy.branch}`, meds: selectedMeds.map(i => MOCK_MEDICINES[i].name).join(', '), status: 'Awaiting Doctor Approval', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...prev]);
        setUploadState('idle'); setSelectedMeds([]); setSelectedPharmacy(null); setShowPharmacy(false); setTab('pending');
    };

    const getStatusStyle = (status) => {
        if (status.includes('Awaiting')) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (status.includes('Sent')) return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-8 px-4">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center"><Pill className="w-5 h-5 text-white" /></div>
                    Pharmacy & Refills
                </h2>
                <p className="text-slate-500 mt-1">Upload prescriptions, request refills, and find nearby pharmacies.</p>
            </div>

            <div className="flex gap-2 mb-6">
                {[{ id: 'upload', label: 'New Refill' }, { id: 'pending', label: `Pending (${pendingRequests.length})` }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{t.label}</button>
                ))}
            </div>

            {tab === 'upload' && (
                <div className="space-y-6">
                    {uploadState === 'idle' && (
                        <div onClick={handleUpload} className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                            <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                            <h3 className="text-lg font-bold text-slate-700 mb-1">Upload Prescription</h3>
                            <p className="text-sm text-slate-400">Drag & drop your prescription image/PDF here, or click to browse</p>
                            <p className="text-xs text-slate-300 mt-2">Supports: JPG, PNG, PDF (Max 10MB)</p>
                        </div>
                    )}

                    {uploadState === 'processing' && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Extracting Medicine Data...</h3>
                            <div className="w-56 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '70%' }} /></div>
                            <p className="text-xs text-slate-400 mt-3">Using OCR to identify medicines from your prescription</p>
                        </div>
                    )}

                    {uploadState === 'done' && !showPharmacy && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div><h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Extracted Medicines</h3><p className="text-sm text-slate-500 mt-1">{selectedMeds.length} of {MOCK_MEDICINES.length} selected</p></div>
                                <button onClick={selectAll} className="text-xs font-bold text-blue-600 hover:underline">Select All</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {MOCK_MEDICINES.map((med, i) => (
                                    <label key={i} className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input type="checkbox" checked={selectedMeds.includes(i)} onChange={() => toggleMed(i)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <div className="flex-1"><p className="text-sm font-bold text-slate-900">{med.name}</p><p className="text-xs text-slate-500">{med.qty}</p></div>
                                        <span className="text-sm font-bold text-slate-700">{med.price}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                <button onClick={() => { selectAll(); setShowPharmacy(true); }} className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-[0.98] transition-all">Refill Entire Prescription</button>
                                <button disabled={selectedMeds.length === 0} onClick={() => setShowPharmacy(true)} className={`flex-1 px-6 py-3 rounded-xl font-bold border transition-all ${selectedMeds.length > 0 ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'border-slate-200 text-slate-400 cursor-not-allowed'}`}>Refill Selected ({selectedMeds.length})</button>
                            </div>
                        </div>
                    )}

                    {showPharmacy && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Choose Your Pharmacy</h3>
                            <div className="flex flex-wrap gap-3 mb-2">
                                {CHAINS.map(chain => (
                                    <button key={chain} onClick={() => setSelectedPharmacy(PHARMACIES.find(p => p.name.includes(chain.split(' ')[0])))} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"><ShoppingBag className="w-4 h-4 inline mr-2 text-slate-400" />{chain}</button>
                                ))}
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                                <div className="px-6 py-3 bg-slate-50 flex items-center gap-2 rounded-t-2xl"><Navigation className="w-4 h-4 text-blue-600" /><span className="text-sm font-bold text-slate-700">Nearby Pharmacies</span></div>
                                {PHARMACIES.map((ph, i) => (
                                    <button key={i} onClick={() => setSelectedPharmacy(ph)} className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all ${selectedPharmacy?.name === ph.name ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900">{ph.name} <span className="font-normal text-slate-500">— {ph.branch}</span></p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ph.distance}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ph.hours}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {ph.rating}</span>
                                            </div>
                                        </div>
                                        {ph.stock ? <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">In Stock</span> : <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-bold border border-red-200 shrink-0">Out of Stock</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-slate-100 rounded-2xl h-48 flex items-center justify-center border border-slate-200">
                                <div className="text-center"><MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm font-semibold text-slate-400">Interactive Map</p><p className="text-xs text-slate-300">Google Maps integration placeholder</p></div>
                            </div>
                            {selectedPharmacy && (
                                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 animate-in fade-in">
                                    <p className="text-sm font-bold text-blue-800 mb-1">Sending to: {selectedPharmacy.name} — {selectedPharmacy.branch}</p>
                                    <p className="text-xs text-blue-600 mb-4">{selectedMeds.length} medicine(s) • Prescription image attached</p>
                                    <button onClick={handleRefill} className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"><Package className="w-5 h-5" /> Request Refill <ChevronRight className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {tab === 'pending' && (
                <div className="space-y-4">
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm"><Package className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-sm text-slate-400 font-medium">No pending refill requests</p></div>
                    ) : (
                        pendingRequests.map((req) => (
                            <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div><p className="text-sm font-bold text-slate-900">{req.pharmacy}</p><p className="text-xs text-slate-500 mt-1">{req.meds}</p><p className="text-xs text-slate-400 mt-1">{req.date}</p></div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getStatusStyle(req.status)}`}>{req.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
