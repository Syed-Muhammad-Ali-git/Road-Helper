import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { RideRequestDoc } from "@/types";

interface AdminStats {
  totalUsers: number;
  activeHelpers: number;
  completedJobs: number;
  pendingRequests: number;
  totalRevenue: number;
  platformCommission: number;
}

interface AdminRequest {
  id: string;
  user: string;
  type: string;
  status: string;
  helper: string;
  amount: number;
  hasCommissionPaid: boolean;
  createdAt: Date;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Helper" | "Admin";
  status: "Active" | "Inactive" | "Suspended";
  lastActive: Date;
}

interface RevenueDataPoint {
  day: string;
  total: number;
  platform: number;
}

/**
 * Get admin dashboard stats from Firebase
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get total users count
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    const totalUsers = usersSnapshot.size;

    // Get active helpers count
    const helpersQuery = query(
      collection(db, COLLECTIONS.USERS),
      where("role", "==", "helper"),
      where("status", "==", "active"),
    );
    const helpersSnapshot = await getDocs(helpersQuery);
    const activeHelpers = helpersSnapshot.size;

    // Get completed jobs
    const completedQuery = query(
      collection(db, COLLECTIONS.RIDE_REQUESTS),
      where("status", "==", "completed"),
    );
    const completedSnapshot = await getDocs(completedQuery);
    const completedJobs = completedSnapshot.size;

    // Get pending requests
    const pendingQuery = query(
      collection(db, COLLECTIONS.RIDE_REQUESTS),
      where("status", "==", "pending"),
    );
    const pendingSnapshot = await getDocs(pendingQuery);
    const pendingRequests = pendingSnapshot.size;

    // Calculate revenue from completed requests
    let totalRevenue = 0;
    let platformCommission = 0;
    completedSnapshot.forEach((doc) => {
      const data = doc.data() as any;
      // Assuming there's a cost field in the request
      if (data.cost) {
        totalRevenue += data.cost;
        platformCommission += data.cost * 0.2; // 20% commission
      }
    });

    return {
      totalUsers,
      activeHelpers,
      completedJobs,
      pendingRequests,
      totalRevenue,
      platformCommission,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      activeHelpers: 0,
      completedJobs: 0,
      pendingRequests: 0,
      totalRevenue: 0,
      platformCommission: 0,
    };
  }
}

/**
 * Subscribe to recent requests for admin
 */
export function subscribeToAdminRequests(
  callback: (requests: AdminRequest[]) => void,
  limitCount = 10,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );

  return onSnapshot(q, (snapshot) => {
    const requests: AdminRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      requests.push({
        id: doc.id,
        user: data.customerName || "Unknown",
        type: data.serviceType || "Unknown",
        status:
          data.status.charAt(0).toUpperCase() + data.status.slice(1).replace("_", " ") ||
          "Pending",
        helper: data.helperName || "---",
        amount: data.cost || 0,
        hasCommissionPaid: data.hasCommissionPaid || false,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      });
    });
    callback(requests);
  });
}

/**
 * Subscribe to all users for admin
 */
export function subscribeToAdminUsers(
  callback: (users: AdminUser[]) => void,
  pageSize = 50,
): Unsubscribe {
  const q = query(collection(db, COLLECTIONS.USERS), limit(pageSize));

  return onSnapshot(q, (snapshot) => {
    const users: AdminUser[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      users.push({
        id: doc.id,
        name: data.displayName || "Unknown",
        email: data.email || "",
        role: (data.role?.charAt(0).toUpperCase() + data.role?.slice(1)) || "Customer",
        status:
          data.status === "active"
            ? "Active"
            : data.status === "suspended"
              ? "Suspended"
              : "Inactive",
        lastActive: data.lastActive?.toDate?.() || new Date(),
      });
    });
    callback(users);
  });
}

/**
 * Get revenue data for the last 8 days
 */
export async function getRevenueData(): Promise<RevenueDataPoint[]> {
  try {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
    const revenueData: RevenueDataPoint[] = [];

    // Get requests from the last 8 days
    const eighthDayAgo = new Date();
    eighthDayAgo.setDate(eighthDayAgo.getDate() - 8);

    const q = query(
      collection(db, COLLECTIONS.RIDE_REQUESTS),
      where("createdAt", ">=", Timestamp.fromDate(eighthDayAgo)),
      where("status", "==", "completed"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);
    const dataByDay: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as any;
      const date = data.createdAt?.toDate?.() || new Date();
      const dayName = days[date.getDay()];
      dataByDay[dayName] = (dataByDay[dayName] || 0) + (data.cost || 0);
    });

    // Fill in days with 0 if no data
    days.forEach((day) => {
      const total = dataByDay[day] || 0;
      revenueData.push({
        day,
        total,
        platform: Math.round(total * 0.2), // 20% commission
      });
    });

    return revenueData;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return [];
  }
}
