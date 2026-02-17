import { Timestamp } from "firebase/firestore";

// ============================================
// USER TYPES
// ============================================

export interface BaseUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface CustomerProfile extends BaseUser {
  role: "customer";
  address?: string;
  preferredLanguage?: "en" | "ur" | "roman";
  totalRequests: number;
  completedRequests: number;
}

export interface HelperProfile extends BaseUser {
  role: "helper";
  services: string[];
  vehicleType?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  rating: number;
  totalEarnings: number;
  completedJobs: number;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Timestamp;
  };
}

export interface AdminProfile extends BaseUser {
  role: "admin";
  permissions: string[];
}

export type UserProfile = CustomerProfile | HelperProfile | AdminProfile;

// ============================================
// REQUEST TYPES
// ============================================

export type RequestStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RideRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerPhoto?: string;
  
  helperId?: string;
  helperName?: string;
  helperPhone?: string;
  helperPhoto?: string;
  
  serviceType: string;
  status: RequestStatus;
  
  pickupLocation: Location;
  dropoffLocation?: Location;
  currentLocation?: Location;
  
  description?: string;
  estimatedCost?: number;
  actualCost?: number;
  
  requestedAt: Timestamp;
  acceptedAt?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  
  rating?: number;
  feedback?: string;
  
  metadata?: Record<string, unknown>;
}

// ============================================
// EARNINGS TYPES
// ============================================

export interface EarningRecord {
  id: string;
  helperId: string;
  requestId: string;
  amount: number;
  commission: number;
  netAmount: number;
  date: Timestamp;
  status: "pending" | "paid" | "cancelled";
  paymentMethod?: string;
  transactionId?: string;
}

export interface HelperEarnings {
  helperId: string;
  totalEarnings: number;
  totalCommission: number;
  netEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  earnings: EarningRecord[];
}

// ============================================
// ADMIN STATISTICS TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalHelpers: number;
  activeHelpers: number;
  
  totalRequests: number;
  pendingRequests: number;
  activeRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  
  averageRating: number;
  totalRatings: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  requests: number;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
  role: "customer" | "helper" | "admin";
}

export interface RegisterFormData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  role: "customer" | "helper";
  services?: string[];
  vehicleType?: string;
  vehicleNumber?: string;
}

export interface RequestFormData {
  serviceType: string;
  pickupLocation: Location;
  dropoffLocation?: Location;
  description?: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  address?: string;
  services?: string[];
  vehicleType?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface Particle {
  x: string;
  y: string;
  y_target: string;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export interface AnimationVariant {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "brand";
  fullScreen?: boolean;
  message?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncFunction<T = void> = () => Promise<T>;

export type EventHandler<T = Event> = (event: T) => void;

export type ValueOf<T> = T[keyof T];
