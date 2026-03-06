import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  GeoPoint,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

// ——— TYPES ———
export type ServiceType =
  | "towing"
  | "tire-change"
  | "fuel-delivery"
  | "battery-jump"
  | "lockout";
export type RequestStatus =
  | "pending"
  | "accepted"
  | "en-route"
  | "arrived"
  | "completed"
  | "cancelled";
export type UserRole = "customer" | "helper" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  createdAt: Timestamp;
  isAvailable?: boolean; // For helpers
  location?: GeoPoint; // For helpers (real-time)
  services?: ServiceType[]; // For helpers
  password?: string; // Stored unhashed as requested by user
  vehicle?: { make: string; model: string; year: string; color: string }; // For customers

  // Subscription / Monetization
  subscriptionType: "free" | "premium";
  freeRidesRemaining: number;
  isPremiumActive: boolean;
  commissionRate?: number; // For helpers, e.g. 0.2 (20%)
}

export interface HelpRequest {
  id?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  helperId?: string;
  helperName?: string;
  service: ServiceType;
  status: RequestStatus;
  location: { lat: number; lng: number; address: string };
  price?: number;
  notes?: string;
  helperLoc?: { lat: number; lng: number }; // For real-time tracking
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  rating?: number;
  review?: string;
}

// ——— USER OPERATIONS ———
export const userOps = {
  async create(
    uid: string,
    data: Omit<
      UserProfile,
      | "uid"
      | "createdAt"
      | "rating"
      | "totalJobs"
      | "totalEarnings"
      | "subscriptionType"
      | "freeRidesRemaining"
      | "isPremiumActive"
    >,
  ): Promise<void> {
    await setDoc(doc(db, "users", uid), {
      ...data,
      uid,
      rating: 0,
      totalJobs: 0,
      totalEarnings: 0,
      createdAt: serverTimestamp(),
      subscriptionType: "free",
      freeRidesRemaining: 10,
      isPremiumActive: false,
      commissionRate: data.role === "helper" ? 0.2 : undefined,
    });
  },

  async get(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  async update(uid: string, data: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, "users", uid), data);
  },

  subscribeToUser(uid: string, cb: (user: UserProfile | null) => void) {
    return onSnapshot(doc(db, "users", uid), (snap) => {
      cb(snap.exists() ? (snap.data() as UserProfile) : null);
    });
  },

  async updateHelperLocation(
    uid: string,
    lat: number,
    lng: number,
  ): Promise<void> {
    await updateDoc(doc(db, "users", uid), {
      location: new GeoPoint(lat, lng),
    });
  },
};

// ——— REQUEST OPERATIONS ———
export const requestOps = {
  async create(
    data: Omit<HelpRequest, "id" | "createdAt" | "status">,
  ): Promise<string> {
    const ref = await addDoc(collection(db, "requests"), {
      ...data,
      status: "pending" as RequestStatus,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<HelpRequest>): Promise<void> {
    await updateDoc(doc(db, "requests", id), data);
  },

  async accept(
    requestId: string,
    helperId: string,
    helperName: string,
    price: number,
  ): Promise<void> {
    await updateDoc(doc(db, "requests", requestId), {
      helperId,
      helperName,
      price,
      status: "accepted" as RequestStatus,
      acceptedAt: serverTimestamp(),
    });
  },

  async complete(
    requestId: string,
    customerId: string,
    helperId: string,
  ): Promise<void> {
    await updateDoc(doc(db, "requests", requestId), {
      status: "completed" as RequestStatus,
      completedAt: serverTimestamp(),
    });
    // Update stats
    const [customerSnap, helperSnap] = await Promise.all([
      getDoc(doc(db, "users", customerId)),
      getDoc(doc(db, "users", helperId)),
    ]);
    if (customerSnap.exists()) {
      const c = customerSnap.data() as UserProfile;
      const updates: any = {
        totalJobs: (c.totalJobs || 0) + 1,
      };
      if (c.subscriptionType === "free" && c.freeRidesRemaining > 0) {
        updates.freeRidesRemaining = c.freeRidesRemaining - 1;
      }
      await updateDoc(doc(db, "users", customerId), updates);
    }
    if (helperSnap.exists()) {
      const h = helperSnap.data() as UserProfile;
      const req = (
        await getDoc(doc(db, "requests", requestId))
      ).data() as HelpRequest;

      const earnings = req.price || 0;
      const commission = h.commissionRate ? earnings * h.commissionRate : 0;
      const netEarnings = earnings - commission;

      await updateDoc(doc(db, "users", helperId), {
        totalJobs: (h.totalJobs || 0) + 1,
        totalEarnings: (h.totalEarnings || 0) + netEarnings,
      });

      // Log commission for admin
      await addDoc(collection(db, "commissions"), {
        requestId,
        helperId,
        helperName: h.name,
        amount: commission,
        totalPrice: earnings,
        createdAt: serverTimestamp(),
      });
    }
  },

  async cancel(requestId: string): Promise<void> {
    await updateDoc(doc(db, "requests", requestId), {
      status: "cancelled" as RequestStatus,
    });
  },

  async rate(
    requestId: string,
    rating: number,
    review: string,
    helperId: string,
  ): Promise<void> {
    await updateDoc(doc(db, "requests", requestId), { rating, review });
    // Update helper's average rating
    const helperRequests = await getDocs(
      query(
        collection(db, "requests"),
        where("helperId", "==", helperId),
        where("rating", "!=", null),
      ),
    );
    const ratings = helperRequests.docs.map((d) => d.data().rating as number);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await updateDoc(doc(db, "users", helperId), {
      rating: Math.round(avg * 10) / 10,
    });
  },

  // Real-time listeners
  subscribeToRequest(requestId: string, cb: (req: HelpRequest | null) => void) {
    return onSnapshot(doc(db, "requests", requestId), (snap) => {
      cb(
        snap.exists() ? ({ id: snap.id, ...snap.data() } as HelpRequest) : null,
      );
    });
  },

  subscribeToCustomerRequests(
    customerId: string,
    cb: (reqs: HelpRequest[]) => void,
  ) {
    return onSnapshot(
      query(collection(db, "requests"), where("customerId", "==", customerId)),
      (snap) => {
        const docs = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
        );
        docs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        cb(docs);
      },
    );
  },

  subscribeToHelperRequests(
    helperId: string,
    status: RequestStatus[],
    cb: (reqs: HelpRequest[]) => void,
  ) {
    const constraints: QueryConstraint[] = [];
    if (status.length === 1)
      constraints.unshift(where("status", "==", status[0]));
    return onSnapshot(
      query(
        collection(db, "requests"),
        where("helperId", "==", helperId),
        ...constraints,
      ),
      (snap) => {
        const docs = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
        );
        docs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        cb(docs);
      },
    );
  },

  subscribeToPendingRequests(cb: (reqs: HelpRequest[]) => void) {
    return onSnapshot(
      query(
        collection(db, "requests"),
        where("status", "==", "pending"),
        limit(20),
      ),
      (snap) => {
        const docs = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
        );
        docs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        cb(docs);
      },
    );
  },

  async getCustomerHistory(customerId: string): Promise<HelpRequest[]> {
    const snap = await getDocs(
      query(collection(db, "requests"), where("customerId", "==", customerId)),
    );
    const docs = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
    );
    docs.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    return docs;
  },

  async getHelperEarnings(
    helperId: string,
  ): Promise<{ total: number; thisMonth: number; history: HelpRequest[] }> {
    const snap = await getDocs(
      query(
        collection(db, "requests"),
        where("helperId", "==", helperId),
        where("status", "==", "completed"),
      ),
    );
    const history = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as HelpRequest,
    );
    const total = history.reduce((a, r) => a + (r.price || 0), 0);
    const now = new Date();
    const thisMonth = history
      .filter((r) => {
        const d = r.completedAt?.toDate();
        return (
          d &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((a, r) => a + (r.price || 0), 0);
    return { total, thisMonth, history };
  },
};
