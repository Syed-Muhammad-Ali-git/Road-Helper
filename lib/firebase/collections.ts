/**
 * Firestore collection names - single source of truth
 */
export const COLLECTIONS = {
  USERS: "users",
  ADMINS: "admins",
  HELPERS: "helpers",
  CUSTOMERS: "customers",
  SERVICES: "services",
  RIDES: "rides",
  REQUESTS: "requests",
  RIDE_REQUESTS: "rideRequests",
  USER_LOCATIONS: "userLocations",
  FEEDBACK: "feedback",
  PLANS: "plans",
  PAYMENTS: "payments",
  NOTIFICATIONS: "notifications",
} as const;
