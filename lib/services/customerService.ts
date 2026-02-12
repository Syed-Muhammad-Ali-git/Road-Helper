import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";

/**
 * Subscribe to customer's ride requests
 */
export function subscribeToCustomerRequests(
  customerId: string,
  callback: (requests: any[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("customerId", "==", customerId),
  );

  return onSnapshot(q, (snapshot) => {
    const requests: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    callback(requests);
  });
}

/**
 * Get customer's request history
 */
export async function getCustomerRequestHistory(customerId: string) {
  try {
    const q = query(
      collection(db, COLLECTIONS.RIDE_REQUESTS),
      where("customerId", "==", customerId),
    );
    const snapshot = await getDocs(q);
    const requests: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      requests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    return requests;
  } catch (error) {
    console.error("Error fetching customer history:", error);
    return [];
  }
}

/**
 * Subscribe to helper's active jobs
 */
export function subscribeToHelperJobs(
  helperId: string,
  callback: (jobs: any[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("helperId", "==", helperId),
    where("status", "!=", "completed"),
  );

  return onSnapshot(q, (snapshot) => {
    const jobs: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      });
    });
    callback(jobs);
  });
}

/**
 * Subscribe to helper's earnings
 */
export function subscribeToHelperEarnings(
  helperId: string,
  callback: (earnings: { total: number; paid: number; pending: number }) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("helperId", "==", helperId),
    where("status", "==", "completed"),
  );

  return onSnapshot(q, (snapshot) => {
    let total = 0;
    let paid = 0;
    let pending = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      const amount = data.cost || 0;
      total += amount;

      if (data.hasCommissionPaid) {
        paid += amount;
      } else {
        pending += amount;
      }
    });

    callback({ total, paid, pending });
  });
}
