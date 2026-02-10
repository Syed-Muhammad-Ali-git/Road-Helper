import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function assignPlanToCurrentUser(planId: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in.");
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    planId,
    updatedAt: serverTimestamp(),
  });
}
