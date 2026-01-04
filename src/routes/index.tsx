import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout";
import {
  LoginPage,
  DashboardPage,
  CustomersPage,
  PaymentsPage,
  NotFoundPage,
  CreateCustomerPage,
  CreatePaymentPage,
  CustomerDetailPage,
} from "../pages";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routes";

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: ROUTES.CUSTOMERS,
            element: <CustomersPage />,
          },
          {
            path: ROUTES.CREATE_CUSTOMER,
            element: <CreateCustomerPage />,
          },
          {
            path: ROUTES.CUSTOMER_DETAIL,
            element: <CustomerDetailPage />,
          },
          {
            path: ROUTES.PAYMENTS,
            element: <PaymentsPage />,
          },
          {
            path: ROUTES.CREATE_PAYMENT,
            element: <CreatePaymentPage />,
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
