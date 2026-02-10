import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch } from "../index";
import type { UserRole } from "@/app/types";
import {
  loginWithEmail as serviceLoginWithEmail,
  loginWithGoogle as serviceLoginWithGoogle,
  clearSession,
} from "@/lib/services/authService";

export interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole | null;
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: {
        payload: {
          uid: string;
          email: string | null;
          displayName: string | null;
          photoURL: string | null;
          role: UserRole;
        } | null;
      }
    ) => {
      state.user = action.payload;
    },
    setToken: (state, action: { payload: string | null }) => {
      state.token = action.payload;
    },
    setLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setUser, setToken, setLoading, setError, logout } =
  authSlice.actions;

// Manual async thunk - Firebase calls ONLY inside
const setAuthCookies = (token: string, role: UserRole) => {
  const { setCookie } = require("cookies-next");
  setCookie("token", token, { maxAge: 60 * 60 * 24 * 7, path: "/" });
  setCookie("role", role, { maxAge: 60 * 60 * 24 * 7, path: "/" });
};

export const loginWithEmail =
  (email: string, password: string, role: UserRole) =>
  async (dispatch: AppDispatch): Promise<{ success: boolean; error?: string }> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { user, token } = await serviceLoginWithEmail({ role, email, password });
      dispatch(setUser({
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        role,
      }));
      dispatch(setToken(token));
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      dispatch(setError(message));
      dispatch(setLoading(false));
      return { success: false, error: message };
    }
  };

export const loginWithGoogle =
  (role: UserRole) =>
  async (dispatch: AppDispatch): Promise<{ success: boolean; error?: string }> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { user, token } = await serviceLoginWithGoogle({ role });
      dispatch(setUser({
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        role,
      }));
      dispatch(setToken(token));
      dispatch(setLoading(false));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google login failed";
      dispatch(setError(message));
      dispatch(setLoading(false));
      return { success: false, error: message };
    }
  };

export const logoutUser =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const { clearAuthStorage } = await import("@/lib/auth-utils");
    try {
      await clearSession();
    } finally {
      clearAuthStorage();
      dispatch(logout());
    }
  };

export default authSlice.reducer;
