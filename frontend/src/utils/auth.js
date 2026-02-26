import { supabase } from '../supabase';

// Authentication
export async function signup(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    });
    if (error) throw error;
    return data.user;
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// Patient Details
export async function savePatientDetails(userId, details) {
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

    if (error) {
        console.error('Failed to save patient details', error);
        throw error;
    }
}

export async function getPatientDetails(userId) {
    const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Not Found" error
        console.error('Failed to get patient details', error);
        return null;
    }

    // Maps DB fields back to frontend state
    return data ? {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone || '',
        age: data.age || '',
        gender: data.gender || '',
    } : null;
}

// Appointments
export async function saveAppointment(appointment) {
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

export async function getAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    // Map back to frontend shape
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

// Triage History
export async function saveTriageHistory(historyItem) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Silent return if not logged in (e.g. guest symptom check)

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

export async function getTriageHistory() {
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

export async function clearTriageHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('triage_history')
        .delete()
        .eq('user_id', user.id);

    if (error) throw error;
}
