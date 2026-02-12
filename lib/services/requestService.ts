import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
  type Timestamp,
} from "firebase/firestore";

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof (v as Timestamp).toDate === "function") return (v as Timestamp).toDate();
  return new Date();
}
import { db } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type {
  GeoLocation,
  RideRequestDoc,
  RideStatus,
  ServiceType,
} from "@/types";

export interface CreateRideRequestInput {
  customerId: string;
  customerName?: string;
  customerPhone?: string | null;
  serviceType: ServiceType;
  location: GeoLocation;
  vehicleDetails: string;
  issueDescription: string;
}

export async function createRideRequest(input: CreateRideRequestInput) {
  const ref = await addDoc(collection(db, COLLECTIONS.RIDE_REQUESTS), {
    customerId: input.customerId,
    customerName: input.customerName ?? null,
    customerPhone: input.customerPhone ?? null,
    helperId: null,
    helperName: null,
    serviceType: input.serviceType,
    status: "pending" as RideStatus,
    location: input.location,
    vehicleDetails: input.vehicleDetails,
    issueDescription: input.issueDescription,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    acceptedAt: null,
    completedAt: null,
    helperLocation: null,
    customerLocation: input.location,
  });
  return ref.id;
}

export async function acceptRideRequest(params: {
  requestId: string;
  helperId: string;
  helperName?: string;
  helperLocation?: GeoLocation | null;
}) {
  const ref = doc(db, COLLECTIONS.RIDE_REQUESTS, params.requestId);
  await updateDoc(ref, {
    helperId: params.helperId,
    helperName: params.helperName ?? null,
    status: "accepted" as RideStatus,
    acceptedAt: serverTimestamp(),
    helperLocation: params.helperLocation ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateRideStatus(params: {
  requestId: string;
  status: RideStatus;
  helperLocation?: GeoLocation | null;
  customerLocation?: GeoLocation | null;
}) {
  const ref = doc(db, COLLECTIONS.RIDE_REQUESTS, params.requestId);
  await updateDoc(ref, {
    status: params.status,
    helperLocation:
      typeof params.helperLocation === "undefined"
        ? undefined
        : params.helperLocation,
    customerLocation:
      typeof params.customerLocation === "undefined"
        ? undefined
        : params.customerLocation,
    completedAt: params.status === "completed" ? serverTimestamp() : undefined,
    updatedAt: serverTimestamp(),
  });
}

export async function updateRideLocations(params: {
  requestId: string;
  helperLocation?: GeoLocation | null;
  customerLocation?: GeoLocation | null;
}) {
  const ref = doc(db, COLLECTIONS.RIDE_REQUESTS, params.requestId);
  await updateDoc(ref, {
    helperLocation:
      typeof params.helperLocation === "undefined"
        ? undefined
        : params.helperLocation,
    customerLocation:
      typeof params.customerLocation === "undefined"
        ? undefined
        : params.customerLocation,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeRideRequest(
  requestId: string,
  cb: (req: ({ id: string } & RideRequestDoc) | null) => void,
): Unsubscribe {
  const ref = doc(db, COLLECTIONS.RIDE_REQUESTS, requestId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return cb(null);
    const data = snap.data() as Record<string, unknown>;
    cb({
      id: snap.id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      acceptedAt: data.acceptedAt ? toDate(data.acceptedAt) : undefined,
      completedAt: data.completedAt ? toDate(data.completedAt) : undefined,
    } as { id: string } & RideRequestDoc);
  });
}

export function subscribePendingRequests(params: {
  cb: (reqs: Array<{ id: string } & RideRequestDoc>) => void;
}): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      params.cb(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } as { id: string } & RideRequestDoc;
        }),
      );
    },
    (err) => console.error("[subscribePendingRequests]", err),
  );
}

export function subscribeHelperCompletedCount(
  helperId: string,
  cb: (count: number) => void,
): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("helperId", "==", helperId),
    where("status", "==", "completed"),
  );
  return onSnapshot(q, (snap) => cb(snap.size), (err) => console.error("[subscribeHelperCompletedCount]", err));
}

export function subscribeHelperActiveJobs(params: {
  helperId: string;
  cb: (reqs: Array<{ id: string } & RideRequestDoc>) => void;
}): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("helperId", "==", params.helperId),
    where("status", "in", ["accepted", "in_progress"]),
  );
  return onSnapshot(
    q,
    (snap) => {
      params.cb(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
          } as { id: string } & RideRequestDoc;
        }),
      );
    },
    (err) => console.error("[subscribeHelperActiveJobs]", err),
  );
}

export function subscribeCustomerRequests(params: {
  customerId: string;
  cb: (reqs: Array<{ id: string } & RideRequestDoc>) => void;
}): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    where("customerId", "==", params.customerId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      params.cb(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
            acceptedAt: data.acceptedAt ? toDate(data.acceptedAt) : undefined,
            completedAt: data.completedAt ? toDate(data.completedAt) : undefined,
          } as { id: string } & RideRequestDoc;
        }),
      );
    },
    (err) => console.error("[subscribeCustomerRequests]", err),
  );
}

export function subscribeAllRequests(params: {
  cb: (reqs: Array<{ id: string } & RideRequestDoc>) => void;
}): Unsubscribe {
  const q = query(
    collection(db, COLLECTIONS.RIDE_REQUESTS),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      params.cb(
        snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
            acceptedAt: data.acceptedAt ? toDate(data.acceptedAt) : undefined,
            completedAt: data.completedAt ? toDate(data.completedAt) : undefined,
          } as { id: string } & RideRequestDoc;
        }),
      );
    },
    (err) => console.error("[subscribeAllRequests]", err),
  );
}

export async function submitFeedback(params: {
  requestId: string;
  fromUid: string;
  fromRole: "customer" | "helper";
  toUid: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const feedbackRef = collection(db, COLLECTIONS.FEEDBACK);
  await addDoc(feedbackRef, {
    requestId: params.requestId,
    fromUid: params.fromUid,
    fromRole: params.fromRole,
    toUid: params.toUid,
    rating: params.rating,
    comment: params.comment ?? null,
    createdAt: serverTimestamp(),
  });
  // Update ride request with rating
  const rideRef = doc(db, COLLECTIONS.RIDE_REQUESTS, params.requestId);
  const field = params.fromRole === "customer" ? "customerRating" : "helperRating";
  await updateDoc(rideRef, {
    [field]: params.rating,
    updatedAt: serverTimestamp(),
  });
}
