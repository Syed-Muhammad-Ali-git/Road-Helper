import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { userOps } from "./firestore";
import type { UserRole } from "./firestore";

const googleProvider = new GoogleAuthProvider();

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
    await userOps.create(user.uid, { email, name, phone, role, password }); // Store plain password as requested
    return user;
  },

  async login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const profile = await userOps.get(user.uid);
    return { user, profile };
  },

  async loginWithGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider);
    let profile = await userOps.get(user.uid);
    if (!profile) {
      // Create profile for new Google user
      await userOps.create(user.uid, {
        email: user.email || "",
        name: user.displayName || "Google User",
        phone: user.phoneNumber || "",
        role: "customer", // Default role
      });
      profile = await userOps.get(user.uid);
    }
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
