import type { UserRole } from "./auth";

export type ServiceType =
  | "mechanic"
  | "tow"
  | "fuel"
  | "medical"
  | "battery"
  | "lockout";

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export type RideStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface FeedbackDoc {
  requestId: string;
  fromUid: string;
  fromRole: "customer" | "helper";
  toUid: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface RideRequestDoc {
  customerId: string;
  customerName?: string;
  customerPhone?: string | null;
  helperId: string | null;
  helperName?: string | null;
  serviceType: ServiceType;
  status: RideStatus;
  location: GeoLocation;
  customerLocation?: GeoLocation | null;
  helperLocation?: GeoLocation | null;
  vehicleDetails: string;
  issueDescription: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  customerRating?: number | null;
  helperRating?: number | null;
}

export interface UserLocationDoc {
  userId: string;
  role: UserRole;
  coords: GeoLocation;
  updatedAt: unknown;
}

