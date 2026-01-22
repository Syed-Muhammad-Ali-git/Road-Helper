import { setCookie, deleteCookie } from "cookies-next";
import { AppDispatch } from "@/redux/store";
import {
  loginUser,
  logoutUser,
  setLoading,
  setError,
  setUserData,
} from "@/redux/reducers/auth-reducer/auth-reducer";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  phone: string;
  role: "client" | "helper";
  serviceType?: string;
}

/**
 * Thunk action to login user using Firebase
 */
export const loginUserAction =
  (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
      const user = userCredential.user;

      // Get custom token or just use uid as a token placeholder for middleware
      const token = await user.getIdToken();

      if (token) {
        setCookie("token", token, { path: "/" });
      }

      // Fetch user data from Firestore
      let userData = null;
      const clientDoc = await getDoc(doc(db, "users", user.uid));
      if (clientDoc.exists()) {
        userData = clientDoc.data();
      } else {
        const helperDoc = await getDoc(doc(db, "helpers", user.uid));
        if (helperDoc.exists()) {
          userData = helperDoc.data();
        }
      }

      dispatch(loginUser({ uid: user.uid, email: user.email }));
      dispatch(setUserData(userData));
      dispatch(setLoading(false));

      return { user, userData };
    } catch (error: any) {
      const message = error.message || "Failed to login";
      dispatch(setError(message));
      dispatch(setLoading(false));
      throw error;
    }
  };

/**
 * Thunk action to register user using Firebase
 */
export const registerUserAction =
  (credentials: RegisterCredentials) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
      const user = userCredential.user;

      const collectionName =
        credentials.role === "client" ? "users" : "helpers";
      const userData = {
        uid: user.uid,
        fullName: credentials.fullName,
        email: credentials.email,
        phone: credentials.phone,
        role: credentials.role,
        createdAt: new Date().toISOString(),
        ...(credentials.role === "helper" && {
          serviceType: credentials.serviceType,
          isOnline: false,
          rating: 5.0,
          totalJobs: 0,
          isVerified: false,
        }),
      };

      await setDoc(doc(db, collectionName, user.uid), userData);

      const token = await user.getIdToken();
      setCookie("token", token, { path: "/" });

      dispatch(loginUser({ uid: user.uid, email: user.email }));
      dispatch(setUserData(userData));
      dispatch(setLoading(false));

      return { user, userData };
    } catch (error: any) {
      const message = error.message || "Failed to register";
      dispatch(setError(message));
      dispatch(setLoading(false));
      throw error;
    }
  };

/**
 * Thunk action to logout user
 */
export const logoutUserAction = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    await signOut(auth);
    deleteCookie("token", { path: "/" });
    dispatch(logoutUser());
  } catch (error) {
    const message = "Failed to logout";
    dispatch(setError(message));
    throw error;
  }
};
