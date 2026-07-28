import { create } from "zustand";

export type UserRole = "Super Admin" | "Company Admin" | "HR" | "Interviewer" | "Candidate";

export type AuthUser = {
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
};

type AuthState = {
  user: AuthUser | null;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  hydrate: () => {
    if (typeof window === "undefined") return;
    const savedUser = window.localStorage.getItem("uneedwhat.auth");
    if (savedUser) {
      try {
        set({ user: JSON.parse(savedUser), isHydrated: true });
        return;
      } catch {
        window.localStorage.removeItem("uneedwhat.auth");
      }
    }
    set({ isHydrated: true });
  },
}));

export function persistUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem("uneedwhat.auth", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("uneedwhat.auth");
  }
}
