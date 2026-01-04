/**
 * Route constants for the application
 * Use these constants instead of hardcoding paths
 */
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  CUSTOMERS: "/customers",
  CUSTOMER_DETAIL: "/customers/:id",
  CREATE_CUSTOMER: "/customers/new",
  PAYMENTS: "/payments",
  CREATE_PAYMENT: "/payments/new",
  NOT_FOUND: "*",
} as const;

/**
 * Helper to generate dynamic routes
 */
export const generateRoute = {
  customerDetail: (id: number | string) => `/customers/${id}`,
} as const;
