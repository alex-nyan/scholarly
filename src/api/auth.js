const USERS_KEY = "scholarly_users";
const SESSION_KEY = "scholarly_session";
const PROFILES_KEY = "scholarly_profiles";

const ADMIN_EMAIL = "admin@scholarly.local";

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setProfileByEmail(email, profile) {
  const profiles = getProfiles();
  profiles[email] = profile;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getProfileByEmail(email) {
  return getProfiles()[email] ?? {};
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function roleForEmail(email) {
  return email === ADMIN_EMAIL ? "admin" : "user";
}

export function getStoredAuth() {
  const session = getSession();
  if (!session?.user) return null;
  const profile = session.profile ?? getProfileByEmail(session.user.email);
  return { user: session.user, profile: profile || {} };
}

export function register(email, password) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) throw new Error("Email and password required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const users = getUsers();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("Email already registered");
  }

  const id = String(Date.now());
  const role = roleForEmail(normalized);
  users.push({ id, email: normalized, password });
  setUsers(users);

  const user = { id, email: normalized, role };
  const profile = getProfileByEmail(normalized);
  setSession({ user, profile });
  return { user, profile };
}

export function login(email, password) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) throw new Error("Email and password required");

  const users = getUsers();
  const found = users.find((u) => u.email === normalized);
  if (!found || found.password !== password) {
    throw new Error("Invalid email or password");
  }

  const role = roleForEmail(normalized);
  const user = { id: found.id || String(Date.now()), email: normalized, role };
  const profile = getProfileByEmail(normalized);
  setSession({ user, profile });
  return { user, profile };
}

export function logout() {
  setSession(null);
}

export function updateStoredProfile(updates) {
  const session = getSession();
  if (!session) throw new Error("Not authenticated");
  const profile = { ...(session.profile || {}), ...updates };
  setProfileByEmail(session.user.email, profile);
  setSession({ ...session, profile });
  return profile;
}

export function getStoredProfile() {
  const session = getSession();
  return session?.profile ?? null;
}
