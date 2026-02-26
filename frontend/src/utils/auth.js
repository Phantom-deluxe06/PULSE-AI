const AUTH_KEY = 'pulse_ai_auth';
const USERS_KEY = 'pulse_ai_users';
const PATIENT_KEY = 'pulse_ai_patient_details';

export function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

export function signup(email, password, name) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        throw new Error('An account with this email already exists.');
    }
    const user = {
        id: Date.now().toString(),
        email,
        password,
        name,
        createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name }));
    return { id: user.id, email: user.email, name: user.name };
}

export function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const session = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return session;
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Patient details persistence
export function savePatientDetails(userId, details) {
    try {
        const all = JSON.parse(localStorage.getItem(PATIENT_KEY)) || {};
        all[userId] = { ...details, updatedAt: new Date().toISOString() };
        localStorage.setItem(PATIENT_KEY, JSON.stringify(all));
    } catch {
        console.error('Failed to save patient details');
    }
}

export function getPatientDetails(userId) {
    try {
        const all = JSON.parse(localStorage.getItem(PATIENT_KEY)) || {};
        return all[userId] || null;
    } catch {
        return null;
    }
}
