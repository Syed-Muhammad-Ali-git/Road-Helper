import { createSlice } from "@reduxjs/toolkit";
import type { HelperProfile, CustomerProfile, AdminProfile } from "@/types";

export type UserProfile = HelperProfile | CustomerProfile | AdminProfile | null;

interface UserState {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: { payload: UserProfile }) => {
      state.profile = action.payload;
    },
    setUserLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
    clearProfile: () => initialState,
  },
});

export const { setProfile, setUserLoading, setUserError, clearProfile } =
  userSlice.actions;

export default userSlice.reducer;
