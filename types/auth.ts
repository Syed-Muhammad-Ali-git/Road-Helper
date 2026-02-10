export type UserRole = "admin" | "helper" | "customer";

export type AuthProviderType = "password" | "google";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

