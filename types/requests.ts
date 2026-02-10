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

export interface RideRequestDoc {
  customerId: string;
  customerName?: string;
  helperId: string | null;
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
}

export interface UserLocationDoc {
  userId: string;
  role: UserRole;
  coords: GeoLocation;
  updatedAt: unknown;
}

