import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserData } from "../../../types/types";

const initialState: AuthState = {
  user: null,
  userData: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null } | null>,
    ) => {
      state.user = action.payload;
      if (!action.payload) {
        state.userData = null;
        state.loading = false;
      }
    },
    setUserData: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setAuthUser, setUserData, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
