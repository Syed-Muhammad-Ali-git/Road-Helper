import { create } from "zustand";
import { User } from "firebase/auth";
import { authOps } from "@/lib/auth";
import { userOps, type UserProfile, type UserRole } from "@/lib/firestore";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User; profile: UserProfile | null }>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  role: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, role: profile?.role ?? null }),

  init: () => {
    return authOps.onAuthChange(async (user) => {
      if (!user) {
        set({
          user: null,
          profile: null,
          role: null,
          loading: false,
          initialized: true,
        });
        return;
      }
      set({ user, loading: true });

      const p = await userOps.get(user.uid);
      if (p) {
        set({ profile: p, role: p.role, loading: false, initialized: true });
      } else {
        set({ loading: false, initialized: true });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const result = await authOps.login(email, password);
      set({
        user: result.user as User,
        profile: result.profile as UserProfile,
        role: result.profile?.role ?? null,
        loading: false,
      });
      return {
        user: result.user as User,
        profile: result.profile as UserProfile | null,
      };
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (email, password, name, phone, role = "customer") => {
    set({ loading: true });
    try {
      const user = await authOps.register(email, password, name, phone, role);
      const profile = await userOps.get(user.uid);
      set({
        user: user as User,
        profile: profile as UserProfile | null,
        role,
        loading: false,
      });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await authOps.logout();
    set({ user: null, profile: null, role: null });
  },
}));
