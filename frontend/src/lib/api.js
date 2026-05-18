/**
 * Central API client for the self-hosted Express backend.
 * Base URL: http://localhost:4000
 * JWT token is stored in localStorage under 'dogood_token'.
 */

const BASE_URL = 'http://localhost:4000/api';

export function getToken() {
  return localStorage.getItem('dogood_token');
}

export function setToken(token) {
  localStorage.setItem('dogood_token', token);
}

export function clearToken() {
  localStorage.removeItem('dogood_token');
  localStorage.removeItem('dogood_user');
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('dogood_user'));
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem('dogood_user', JSON.stringify(user));
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Hardcoded demo user
const DEMO_USER = {
  id: 'demo-001',
  full_name: 'Priyanka Hugar',
  email: 'priyanka.hugar@gmail.com',
  location: '23 Manoel Ave',
  hours_helped: 12,
  people_helped: 8,
  rating: 4.9,
  profile_completion: 80,
  role: 'user',
};
const DEMO_EMAIL = 'priyanka.hugar@gmail.com';
const DEMO_PASSWORD = 'Pilkothi@2';
const DEMO_TOKEN = 'demo-jwt-token-priyanka';

// Auth
export const auth = {
  register: (email, password, full_name, location) => {
    // For demo: treat register as auto-login with provided details
    const user = { ...DEMO_USER, full_name: full_name || DEMO_USER.full_name, email, location: location || DEMO_USER.location };
    setToken(DEMO_TOKEN);
    setStoredUser(user);
    return Promise.resolve({ token: DEMO_TOKEN, user });
  },

  login: (email, password) => {
    // Demo mode: accept any credentials
    const user = { ...DEMO_USER, email: email || DEMO_USER.email };
    setToken(DEMO_TOKEN);
    setStoredUser(user);
    return Promise.resolve({ token: DEMO_TOKEN, user });
  },

  me: () => {
    const stored = getStoredUser();
    if (stored) return Promise.resolve(stored);
    return Promise.resolve(DEMO_USER);
  },

  updateMe: (data) => {
    const updated = { ...getStoredUser(), ...data };
    setStoredUser(updated);
    return Promise.resolve(updated);
  },

  logout: (redirectPath = '/Welcome') => {
    clearToken();
    window.location.href = redirectPath;
  },

  isAuthenticated: () => !!getToken(),
};

// SkillPosts — demo mode (no backend)
export const skillPosts = {
  list: () => Promise.resolve([]),
  create: (data) => Promise.resolve({ id: Date.now().toString(), ...data }),
  update: (id, data) => Promise.resolve({ id, ...data }),
  delete: (id) => Promise.resolve(),
  filter: (filterObj) => Promise.resolve([]),
};

// Gallery — demo mode
export const gallery = {
  list: () => Promise.resolve([]),
  create: (data) => Promise.resolve({ id: Date.now().toString(), ...data }),
};

// Messages — demo mode
export const messages = {
  list: () => Promise.resolve([]),
  create: (data) => Promise.resolve({ id: Date.now().toString(), ...data }),
};