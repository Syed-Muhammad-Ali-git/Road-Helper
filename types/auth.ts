export interface UserData {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: "client" | "helper";
  serviceType?: string;
  isOnline?: boolean;
  rating?: number;
  totalJobs?: number;
  isVerified?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: { uid: string; email: string | null } | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}
