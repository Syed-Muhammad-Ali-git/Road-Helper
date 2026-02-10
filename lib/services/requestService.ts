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
} from "firebase/firestore";
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
  serviceType: ServiceType;
  location: GeoLocation;
  vehicleDetails: string;
  issueDescription: string;
}

export async function createRideRequest(input: CreateRideRequestInput) {
  const ref = await addDoc(collection(db, COLLECTIONS.RIDE_REQUESTS), {
    customerId: input.customerId,
    helperId: null,
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
  helperLocation?: GeoLocation | null;
}) {
  const ref = doc(db, COLLECTIONS.RIDE_REQUESTS, params.requestId);
  await updateDoc(ref, {
    helperId: params.helperId,
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
    cb({ id: snap.id, ...(snap.data() as unknown as RideRequestDoc) });
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
  return onSnapshot(q, (snap) => {
    params.cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as unknown as RideRequestDoc),
      })),
    );
  });
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
  return onSnapshot(q, (snap) => {
    params.cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as unknown as RideRequestDoc),
      })),
    );
  });
}
