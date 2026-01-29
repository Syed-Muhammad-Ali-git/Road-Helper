/**
 * customer-specific protected routes
 */
const customerRoutes = [
  "/customer/dashboard",
  "/customer/history",
  "/customer/profile",
  "/customer/request-help",
  "/customer/request-status/REQ-123",
  
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
];

/**
 * Public routes accessible without authentication
 */
const publicRoutes = ["/login", "/register", "/forgot-password"];

/**
 * All protected routes (for backward compatibility)
 */
const adminRoutes = ["/admin/dashboard"];

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
