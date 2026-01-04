import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Pagination } from "../components/ui";
import { usePayments, useDeletePayment } from "../hooks/usePayments";
import { useCustomers } from "../hooks/useCustomers";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../routes/routes";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: paymentsData, isLoading, isError, error } = usePayments({ page: currentPage });
  const { data: customersData } = useCustomers();
  const deletePayment = useDeletePayment();

  const payments = paymentsData?.data;
  const pagination = paymentsData?.pagination;
  const customers = customersData?.data;

  const handleDelete = async (id: number) => {
    if (window.confirm(t("payments.deleteConfirm"))) {
      try {
        await deletePayment.mutateAsync(id);
      } catch (error) {
        alert(t("payments.deleteFailed"));
      }
    }
  };

  const getCustomerName = (customerId: number) => {
    const customer = customers?.find((c) => c.id === customerId);
    return customer ? `${customer.fullName} (${customer.company})` : `Customer #${customerId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("payments.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("payments.subtitle")}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_PAYMENT)}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("payments.recordPayment")}
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-danger-600 dark:text-danger-400 font-medium">
              {t("payments.errorLoading", { error: error?.message || "Unknown error" })}
            </p>
          </div>
        ) : !payments || payments.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("payments.noPayments")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("payments.noPaymentsDescription")}
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate(ROUTES.CREATE_PAYMENT)}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t("payments.recordPayment")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.id")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.customer")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.amountPaid")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.paymentDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.installmentNumber")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.notes")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.created")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("payments.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{payment.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getCustomerName(payment.customerId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-success-600 dark:text-success-400">
                        ${payment.amountPaid.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.paymentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.installmentNumber ?? "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {payment.notes || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(payment.id)}
                        isLoading={deletePayment.isPending}
                      >
                        {t("payments.delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </Card>

      {/* Summary Statistics - Current Page */}
      {payments && payments.length > 0 && pagination && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("payments.totalPayments")}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {pagination.totalItems}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Showing {payments.length} on this page
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("payments.totalAmountCollected")} (Page)</p>
              <p className="text-3xl font-bold text-success-600 dark:text-success-400 mt-2">
                ${payments.reduce((sum, p) => sum + p.amountPaid, 0).toFixed(2)}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("payments.averagePayment")} (Page)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${(payments.reduce((sum, p) => sum + p.amountPaid, 0) / payments.length).toFixed(2)}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
