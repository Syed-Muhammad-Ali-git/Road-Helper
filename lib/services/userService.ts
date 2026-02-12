import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { UserRole } from "@/types";

export type AuthProviderType = "password" | "google";

export interface AppUserRecord {
  uid: string;
  email: string; // canonical lowercased email
  role: UserRole;
  authProvider: AuthProviderType;
  displayName: string;
  photoURL?: string | null;
  phone?: string | null;
  createdAt: unknown;
  updatedAt: unknown;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getUserByEmail(email: string) {
  const emailNorm = normalizeEmail(email);
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where("email", "==", emailNorm),
    limit(1),
  );
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap
    ? ({
        id: docSnap.id,
        ...(docSnap.data() as unknown as AppUserRecord),
      } as { id: string } & AppUserRecord)
    : null;
}

export async function getUserByUid(uid: string) {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(ref);
  return snap.exists()
    ? ({
        id: snap.id,
        ...(snap.data() as unknown as AppUserRecord),
      } as { id: string } & AppUserRecord)
    : null;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, COLLECTIONS.USERS));
  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        ...(d.data() as unknown as AppUserRecord),
      }) as { id: string } & AppUserRecord,
  );
}

export async function upsertUserRecord(input: {
  uid: string;
  email: string;
  role: UserRole;
  authProvider: AuthProviderType;
  displayName: string;
  photoURL?: string | null;
  phone?: string | null;
}) {
  const ref = doc(db, COLLECTIONS.USERS, input.uid);
  const existing = await getDoc(ref);
  const record: Partial<AppUserRecord> = {
    uid: input.uid,
    email: normalizeEmail(input.email),
    role: input.role,
    authProvider: input.authProvider,
    displayName: input.displayName,
    photoURL: input.photoURL ?? null,
    phone: input.phone ?? null,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    await setDoc(
      ref,
      { ...record, createdAt: serverTimestamp() },
      { merge: true },
    );
  } else {
    await updateDoc(ref, record as any);
  }

  return ref;
}

export async function deleteUserDataCompletely(uid: string) {
  // Delete user profile
  await deleteDoc(doc(db, COLLECTIONS.USERS, uid));

  // Delete ride requests where user is customer or helper
  const rideReqsCol = collection(db, COLLECTIONS.RIDE_REQUESTS);
  const q1 = query(rideReqsCol, where("customerId", "==", uid), limit(200));
  const q2 = query(rideReqsCol, where("helperId", "==", uid), limit(200));
  const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const toDelete = [...s1.docs, ...s2.docs];
  await Promise.all(
    toDelete.map((d) => deleteDoc(doc(db, COLLECTIONS.RIDE_REQUESTS, d.id))),
  );
}
