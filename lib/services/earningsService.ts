import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface EarningRecord {
  id: string;
  helperId: string;
  requestId: string;
  amount: number; // PKR
  platformFee: number; // 20% commission in PKR
  helperEarning: number; // 80% earning in PKR
  currency: string; // "PKR"
  status: "pending" | "paid";
  createdAt: Date;
  paidAt?: Date;
  serviceType: string;
  customerName: string;
  customerImage?: string;
  rideLocation?: string;
  distance?: number;
}

const EARNINGS_COLLECTION = "earnings";

/**
 * Format amount in PKR currency
 */
export const formatPKR = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Subscribe to helper's real-time earnings
 */
export function subscribeToHelperEarnings(
  helperId: string,
  callback: (earnings: EarningRecord[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, EARNINGS_COLLECTION),
    where("helperId", "==", helperId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const earnings: EarningRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        earnings.push({
          id: doc.id,
          helperId: data.helperId,
          requestId: data.requestId,
          amount: data.amount || 0,
          platformFee: data.platformFee || 0,
          helperEarning: data.helperEarning || 0,
          currency: data.currency || "PKR",
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate?.() || new Date(),
          paidAt: data.paidAt?.toDate?.(),
          serviceType: data.serviceType || "Unknown",
          customerName: data.customerName || "Unknown Customer",
          customerImage: data.customerImage,
          rideLocation: data.rideLocation,
          distance: data.distance,
        } as EarningRecord);
      });
      // Client-side sort: newest first
      earnings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(earnings);
    },
    (err) => {
      console.error("[subscribeToHelperEarnings] Error:", err);
      callback([]); // Stop loader
    },
  );
}

/**
 * Get helper's total earnings statistics
 */
export async function getHelperEarningsStats(helperId: string): Promise<{
  totalEarned: number;
  pendingAmount: number;
  paidAmount: number;
  totalJobs: number;
  averageEarningPerJob: number;
}> {
  try {
    const q = query(
      collection(db, EARNINGS_COLLECTION),
      where("helperId", "==", helperId),
    );

    const snapshot = await getDocs(q);
    let totalEarned = 0;
    let pendingAmount = 0;
    let paidAmount = 0;
    let totalJobs = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const helperEarning = data.helperEarning || 0;
      totalEarned += helperEarning;
      totalJobs += 1;

      if (data.status === "pending") {
        pendingAmount += helperEarning;
      } else if (data.status === "paid") {
        paidAmount += helperEarning;
      }
    });

    const averageEarningPerJob = totalJobs > 0 ? totalEarned / totalJobs : 0;

    return {
      totalEarned,
      pendingAmount,
      paidAmount,
      totalJobs,
      averageEarningPerJob,
    };
  } catch (error) {
    console.error("Error fetching helper earnings stats:", error);
    return {
      totalEarned: 0,
      pendingAmount: 0,
      paidAmount: 0,
      totalJobs: 0,
      averageEarningPerJob: 0,
    };
  }
}

/**
 * Get top earners for admin dashboard
 */
export async function getTopEarners(limitCount: number = 10): Promise<
  Array<{
    helperId: string;
    helperName: string;
    totalEarned: number;
    jobCount: number;
  }>
> {
  try {
    // This requires aggregation - for now return from earnings collection
    const q = query(
      collection(db, EARNINGS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(limitCount * 5),
    );

    const snapshot = await getDocs(q);
    const earnerMap = new Map<
      string,
      { helperName: string; totalEarned: number; jobCount: number }
    >();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const helperId = data.helperId;

      if (!earnerMap.has(helperId)) {
        earnerMap.set(helperId, {
          helperName: data.helperName || "Unknown",
          totalEarned: 0,
          jobCount: 0,
        });
      }

      const existing = earnerMap.get(helperId)!;
      existing.totalEarned += data.helperEarning || 0;
      existing.jobCount += 1;
    });

    return Array.from(earnerMap.entries())
      .map(([helperId, data]) => ({
        helperId,
        ...data,
      }))
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching top earners:", error);
    return [];
  }
}

/**
 * Subscribe to recent earnings for admin
 */
export function subscribeToRecentEarnings(
  callback: (earnings: EarningRecord[]) => void,
  limitCount: number = 20,
): Unsubscribe {
  const q = query(
    collection(db, EARNINGS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );

  return onSnapshot(q, (snapshot) => {
    const earnings: EarningRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      earnings.push({
        id: doc.id,
        helperId: data.helperId,
        requestId: data.requestId,
        amount: data.amount || 0,
        platformFee: data.platformFee || 0,
        helperEarning: data.helperEarning || 0,
        currency: data.currency || "PKR",
        status: data.status || "pending",
        createdAt: data.createdAt?.toDate?.() || new Date(),
        paidAt: data.paidAt?.toDate?.(),
        serviceType: data.serviceType || "Unknown",
        customerName: data.customerName || "Unknown",
        customerImage: data.customerImage,
        rideLocation: data.rideLocation,
        distance: data.distance,
      } as EarningRecord);
    });
    callback(earnings);
  });
}
