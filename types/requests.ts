import type { UserRole } from "./auth";
import React from "react"; // Added for React.ElementType

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

export interface TimelineItem {
  icon: React.ElementType;
  active: boolean;
  title: string;
  time: string;
}

export interface RequestUser {
  name: string;
  phone: string;
  email: string;
}

export interface RequestHelper {
  name: string;
  phone: string;
}

export interface RideRequestDoc {
  id: string;
  timeline: TimelineItem[]; // Changed from any to TimelineItem[]
  notes: string; // Changed from any to string
  user: RequestUser; // Changed from any to RequestUser
  helper: RequestHelper; // Changed from any to RequestHelper
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
  amount?: number; // Added to address the 'any' cast in page.tsx
  paymentStatus?: string; // Added to address the 'any' cast in page.tsx
}

export interface UserLocationDoc {
  userId: string;
  role: UserRole;
  coords: GeoLocation;
  updatedAt: unknown;
}
