/**
 * Public routes accessible without authentication
 */
const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

/**
 * Protected routes requiring authentication
 */
const protectedRoutes = [
  "/",
  "/client/dashboard",
  "/client/history",
  "/client/profile",
  "/client/request-help",
  "/client/request-status",
  "/helper/dashboard",
  "/helper/earnings",
  "/helper/profile",
  "/helper/requests",
  "/helper/active-job",
];

export { publicRoutes, protectedRoutes };
