import { createContext, useContext } from "react";

export type Role = "admin" | "hr" | "sales" | "pm" | "employee";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
};

export const DEMO_USERS: DemoUser[] = [
  { id: "u1", name: "Aanya Sharma", email: "admin@flowpilot.ai", password: "password123", role: "admin", avatar: "AS" },
  { id: "u2", name: "Priya Verma", email: "hr@flowpilot.ai", password: "password123", role: "hr", avatar: "PV" },
  { id: "u3", name: "Rohan Mehta", email: "sales@flowpilot.ai", password: "password123", role: "sales", avatar: "RM" },
  { id: "u4", name: "Karan Iyer", email: "pm@flowpilot.ai", password: "password123", role: "pm", avatar: "KI" },
];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  hr: "HR Manager",
  sales: "Sales Manager",
  pm: "Project Manager",
  employee: "Employee",
};

const KEY = "flowpilot.session";

export type Session = { userId: string; role: Role };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("flowpilot:auth"));
}

export function getCurrentUser(): DemoUser | null {
  const s = getSession();
  if (!s) return null;
  return DEMO_USERS.find((u) => u.id === s.userId) ?? null;
}

export function login(email: string, password: string): DemoUser | null {
  const u = DEMO_USERS.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) return null;
  setSession({ userId: u.id, role: u.role });
  return u;
}

export function logout() {
  setSession(null);
}

export function hasRole(user: DemoUser | null, roles: Role[]): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return roles.includes(user.role);
}

export const AuthContext = createContext<{ user: DemoUser | null; refresh: () => void }>({
  user: null,
  refresh: () => {},
});

export const useAuth = () => useContext(AuthContext);