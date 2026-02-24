import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { userOps } from "./firestore";
import type { UserRole } from "./firestore";

export const authOps = {
  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole,
  ) {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(user, { displayName: name });
    await userOps.create(user.uid, { email, name, phone, role });
    return user;
  },

  async login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const profile = await userOps.get(user.uid);
    return { user, profile };
  },

  async logout() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  onAuthChange(cb: (user: User | null) => void) {
    return onAuthStateChanged(auth, cb);
  },
};
