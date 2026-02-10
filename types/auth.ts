export type UserRole = "admin" | "helper" | "customer";

export type AuthProviderType = "password" | "google";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

export interface HelperProfile extends AuthUser {
  role: "helper";
  // Add additional helper-specific fields here if needed
}

export interface CustomerProfile extends AuthUser {
  role: "customer";
  // Add additional customer-specific fields here if needed
}

export interface AdminProfile extends AuthUser {
  role: "admin";
  // Add additional admin-specific fields here if needed
}

