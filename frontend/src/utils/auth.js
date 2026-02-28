import { supabase, isSupabaseConfigured } from '../supabase';

const STORAGE_USER = 'pulse_ai_user';
const STORAGE_APPOINTMENTS = 'pulse_ai_appointments';
const STORAGE_HISTORY = 'pulse_ai_triage_history';

// ==================== AUTH ====================

export async function signup(email, password, name) {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password,
                options: { data: { full_name: name } }
            });

            // If signup succeeded or user already exists, try auto-login
            if (!error || error.message?.includes('already registered')) {
                try {
                    const { data: loginData } = await supabase.auth.signInWithPassword({ email, password });
                    if (loginData?.user) {
                        const user = {
                            id: loginData.user.id,
                            email: loginData.user.email,
                            name: loginData.user.user_metadata?.full_name || name,
                            user_metadata: loginData.user.user_metadata
                        };
                        localStorage.setItem(STORAGE_USER, JSON.stringify(user));
                        return user;
                    }
                } catch { }
            }

            // If Supabase signup returned a user (unverified), save locally anyway
            if (data?.user) {
                const user = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.full_name || name,
                    user_metadata: data.user.user_metadata
                };
                localStorage.setItem(STORAGE_USER, JSON.stringify(user));
                return user;
            }

            if (error && !error.message?.includes('already registered')) throw error;
        } catch (err) {
            // Rate limit or network error — fall through to local user
            console.warn('Supabase signup failed, using local auth:', err.message);
        }
    }
    // localStorage fallback — always works
    const user = { id: Date.now().toString(), email, name, user_metadata: { full_name: name } };
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    return user;
}

export async function login(email, password) {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (!error && data?.user) {
                const user = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.full_name || email.split('@')[0],
                    user_metadata: data.user.user_metadata
                };
                localStorage.setItem(STORAGE_USER, JSON.stringify(user));
                return user;
            }
            // If Supabase login fails, check localStorage for existing local user
            const saved = localStorage.getItem(STORAGE_USER);
            if (saved) {
                const localUser = JSON.parse(saved);
                if (localUser.email === email) return localUser;
            }
            // If no local user either, fall through to create one below
            console.warn('Supabase login failed, using local auth:', error?.message);
        } catch (err) {
            const saved = localStorage.getItem(STORAGE_USER);
            if (saved) {
                const localUser = JSON.parse(saved);
                if (localUser.email === email) return localUser;
            }
            console.warn('Supabase login error, using local auth:', err.message);
        }
    }
    // Always create/return a local user — never block login
    const saved = localStorage.getItem(STORAGE_USER);
    if (saved) {
        const localUser = JSON.parse(saved);
        if (localUser.email === email) return localUser;
    }
    const user = { id: 'local-' + Date.now(), email, name: email.split('@')[0], user_metadata: { full_name: email.split('@')[0] } };
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    return user;
}

export async function logout() {
    if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
    localStorage.removeItem(STORAGE_USER);
}

export function getCurrentUser() {
    if (isSupabaseConfigured) {
        // Supabase async version — but for initial render we use sync localStorage check
    }
    try {
        const saved = localStorage.getItem(STORAGE_USER);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

// ==================== PATIENT DETAILS ====================

export async function savePatientDetails(userId, details) {
    if (isSupabaseConfigured) {
        const { error } = await supabase
            .from('patient_profiles')
            .update({
                first_name: details.firstName,
                last_name: details.lastName,
                phone: details.phone,
                age: parseInt(details.age) || null,
                gender: details.gender,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        if (error) throw error;
    }
}

export async function getPatientDetails(userId) {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('patient_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error && error.code !== 'PGRST116') return null;
        return data ? {
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            phone: data.phone || '',
            age: data.age || '',
            gender: data.gender || '',
        } : null;
    }
    return null;
}

// ==================== APPOINTMENTS ====================

export async function saveAppointment(appointment) {
    if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        const { error } = await supabase
            .from('appointments')
            .insert([{
                user_id: user.id,
                patient_name: appointment.patientName,
                department: appointment.department,
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                urgency: appointment.urgency,
                status: appointment.status,
                triage_summary: appointment.triageSummary,
                recommendation: appointment.recommendation
            }]);
        if (error) throw error;
    }
    // localStorage handled by App.jsx
}

export async function getAppointments() {
    if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(db => ({
            id: db.id,
            patientName: db.patient_name,
            department: db.department,
            date: db.appointment_date,
            time: db.appointment_time,
            urgency: db.urgency,
            status: db.status,
            triageSummary: db.triage_summary,
            recommendation: db.recommendation,
            createdAt: db.created_at
        }));
    }
    // localStorage fallback
    try {
        const saved = localStorage.getItem(STORAGE_APPOINTMENTS);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export async function getAllAppointments() {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('urgency', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(db => ({
            id: db.id,
            patientName: db.patient_name,
            department: db.department,
            date: db.appointment_date,
            time: db.appointment_time,
            urgency: db.urgency,
            status: db.status,
            triageSummary: db.triage_summary,
            recommendation: db.recommendation,
            createdAt: db.created_at
        }));
    }
    // localStorage fallback
    try {
        const saved = localStorage.getItem(STORAGE_APPOINTMENTS);
        return saved ? JSON.parse(saved).sort((a, b) => b.urgency - a.urgency) : [];
    } catch {
        return [];
    }
}

export async function updateAppointmentStatus(appointmentId, newStatus) {
    if (isSupabaseConfigured) {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', appointmentId);

        if (error) throw error;
        return;
    }
    // localStorage fallback
    try {
        const saved = localStorage.getItem(STORAGE_APPOINTMENTS);
        if (saved) {
            const arr = JSON.parse(saved);
            const idx = arr.findIndex(a => a.id === appointmentId);
            if (idx > -1) {
                arr[idx].status = newStatus;
                localStorage.setItem(STORAGE_APPOINTMENTS, JSON.stringify(arr));
            }
        }
    } catch {
        // ignore
    }
}

// ==================== TRIAGE HISTORY ====================

export async function saveTriageHistory(historyItem) {
    if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase
            .from('triage_history')
            .insert([{
                user_id: user.id,
                symptoms: historyItem.symptoms,
                department: historyItem.department,
                urgency: historyItem.urgency,
                summary: historyItem.summary,
                recommendation: historyItem.recommendation
            }]);
        if (error) throw error;
    }
}

export async function getTriageHistory() {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('triage_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) throw error;
        return data.map(db => ({
            id: db.id,
            symptoms: db.symptoms,
            department: db.department,
            urgency: db.urgency,
            summary: db.summary,
            recommendation: db.recommendation,
            timestamp: db.created_at
        }));
    }
    try {
        const saved = localStorage.getItem(STORAGE_HISTORY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

export async function clearTriageHistory() {
    if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase
            .from('triage_history')
            .delete()
            .eq('user_id', user.id);
        if (error) throw error;
    }
    localStorage.removeItem(STORAGE_HISTORY);
}
