import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { setCookie, deleteCookie } from "cookies-next";
import { auth } from "@/lib/firebase/config";
import type { UserRole } from "@/types";
import {
  getUserByEmail,
  deleteUserDataCompletely,
  upsertUserRecord,
  type AuthProviderType,
} from "@/lib/services/userService";

export class AuthRuleError extends Error {
  code:
    | "ROLE_MISMATCH"
    | "PROVIDER_MISMATCH"
    | "EMAIL_ALREADY_REGISTERED_OTHER_ROLE";
  constructor(
    code:
      | "ROLE_MISMATCH"
      | "PROVIDER_MISMATCH"
      | "EMAIL_ALREADY_REGISTERED_OTHER_ROLE",
    message: string,
  ) {
    super(message);
    this.code = code;
  }
}

function setAuthCookies(token: string, role: UserRole) {
  setCookie("token", token, { maxAge: 60 * 60 * 24 * 7, path: "/" });
  setCookie("role", role, { maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function clearSession() {
  deleteCookie("token", { path: "/" });
  deleteCookie("role", { path: "/" });
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
}

async function enforceEmailRoleProvider(params: {
  email: string;
  requestedRole: UserRole;
  requestedProvider: AuthProviderType;
}) {
  const existing = await getUserByEmail(params.email);
  if (!existing) return { existing: null as any };

  if (existing.role && existing.role !== params.requestedRole) {
    throw new AuthRuleError(
      "ROLE_MISMATCH",
      `This email is registered as a ${existing.role}. Please log in as ${existing.role}.`,
    );
  }
  if (
    existing.authProvider &&
    existing.authProvider !== params.requestedProvider
  ) {
    throw new AuthRuleError(
      "PROVIDER_MISMATCH",
      `This email was created using ${existing.authProvider}. Please continue with ${existing.authProvider}.`,
    );
  }
  return { existing };
}

export async function signupWithEmail(params: {
  role: UserRole;
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}) {
  await enforceEmailRoleProvider({
    email: params.email,
    requestedRole: params.role,
    requestedProvider: "password",
  });

  const cred = await createUserWithEmailAndPassword(
    auth,
    params.email,
    params.password,
  );
  await updateProfile(cred.user, { displayName: params.displayName });

  await upsertUserRecord({
    uid: cred.user.uid,
    email: params.email,
    role: params.role,
    authProvider: "password",
    displayName: params.displayName,
    photoURL: cred.user.photoURL ?? null,
    phone: params.phone ?? null,
  });

  const token = await cred.user.getIdToken();
  setAuthCookies(token, params.role);
  return { user: cred.user, token };
}

export async function loginWithEmail(params: {
  role: UserRole;
  email: string;
  password: string;
}) {
  await enforceEmailRoleProvider({
    email: params.email,
    requestedRole: params.role,
    requestedProvider: "password",
  });

  const cred = await signInWithEmailAndPassword(
    auth,
    params.email,
    params.password,
  );

  // If legacy accounts exist without Firestore user doc, create it now (locks role).
  const email = cred.user.email;
  if (email) {
    await upsertUserRecord({
      uid: cred.user.uid,
      email,
      role: params.role,
      authProvider: "password",
      displayName: cred.user.displayName ?? email.split("@")[0],
      photoURL: cred.user.photoURL ?? null,
      phone: null,
    });
  }

  const token = await cred.user.getIdToken();
  setAuthCookies(token, params.role);
  return { user: cred.user, token };
}

export async function loginWithGoogle(params: { role: UserRole }) {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const email = cred.user.email;
  if (!email) {
    await clearSession();
    throw new Error("Google account did not provide an email.");
  }

  await enforceEmailRoleProvider({
    email,
    requestedRole: params.role,
    requestedProvider: "google",
  });

  await upsertUserRecord({
    uid: cred.user.uid,
    email,
    role: params.role,
    authProvider: "google",
    displayName: cred.user.displayName ?? email.split("@")[0],
    photoURL: cred.user.photoURL ?? null,
    phone: null,
  });

  const token = await cred.user.getIdToken();
  setAuthCookies(token, params.role);
  return { user: cred.user, token };
}

export async function deleteCurrentAccount() {
  const user = auth.currentUser;
  if (!user) return;
  await deleteUser(user);
  await clearSession();
}

export async function deleteAccountFully() {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  // Attempt Auth deletion first (security requirement). If it fails, we don't delete Firestore.
  await deleteUser(user);
  await deleteUserDataCompletely(uid);
  await clearSession();
}
