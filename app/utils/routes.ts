/**
 * customer-specific protected routes
 */
const customerRoutes = [
  "/customer/dashboard",
  "/customer/history",
  "/customer/profile",
  "/customer/request-help",
  "/customer/request-status",
  "/journey", // dynamic children handled in pathChecker
];

/**
 * Helper-specific protected routes
 */
const helperRoutes = [
  "/helper/dashboard",
  "/helper/earnings",
  "/helper/profile",
  "/helper/requests",
  "/helper/active-job",
  "/journey", // dynamic children handled in pathChecker
];

const adminRoutes = [
  "/admin/dashboard",
  "/admin/requests",
  "/admin/users",
  "/admin/settings",
  "/admin/status",
  "/admin/profile",
];

/**
 * Public routes accessible without authentication
 */
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/admin/login",
  "/admin/signup",
  "/about",
];

/**
 * All protected routes (for backward compatibility)
 */
const protectedRoutes = [...customerRoutes, ...helperRoutes, ...adminRoutes];

export {
  publicRoutes,
  protectedRoutes,
  customerRoutes,
  helperRoutes,
  adminRoutes,
};
