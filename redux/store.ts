import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth-reducer/auth-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Firebase user objects are not serializable
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
