import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Pagination } from "../components/ui";
import { useCustomers, useDeleteCustomer } from "../hooks/useCustomers";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../routes/routes";
import type { Customer } from "../types/api";

export default function CustomersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: customersData,
    isLoading,
    isError,
    error,
  } = useCustomers({
    page: currentPage,
    search: debouncedSearch || undefined
  });
  const deleteCustomer = useDeleteCustomer();

  const customers = customersData?.data;
  const pagination = customersData?.pagination;

  const handleDelete = async (id: number, fullName: string) => {
    if (window.confirm(t("customers.deleteConfirm", { name: fullName }))) {
      try {
        await deleteCustomer.mutateAsync(id);
      } catch (error) {
        alert(t("customers.deleteFailed"));
      }
    }
  };

  const getStatusColor = (status: Customer["customerPaymentStatus"]) => {
    switch (status) {
      case "paid":
        return "!bg-green-100 !text-green-800 dark:!bg-green-900/30 dark:!text-green-300";
      case "inProgress":
        return "!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900/30 dark:!text-yellow-300";
      case "unpaid":
        return "!bg-red-100 !text-red-800 dark:!bg-red-900/30 dark:!text-red-300";
      default:
        return "!bg-gray-100 !text-gray-800 dark:!bg-gray-700 dark:!text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    // Map status to translation key
    return t(`customers.${status}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("customers.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("customers.subtitle")}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.CREATE_CUSTOMER)}>
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
          {t("customers.addCustomer")}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t("customers.searchPlaceholder") || "Search by name or company..."}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-danger-600 dark:text-danger-400 font-medium">
              {t("customers.errorLoading", {
                error: error?.message || "Unknown error",
              })}
            </p>
          </div>
        ) : !customers || customers.length === 0 ? (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("customers.noCustomers")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("customers.noCustomersDescription")}
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate(ROUTES.CREATE_CUSTOMER)}>
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
                {t("customers.addCustomer")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.company")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.contact")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.debtInfo")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.dates")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("customers.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("customers.jmbg")}: {customer.jmbg}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {t("customers.total")}: ${customer.totalDebt.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${customer.installmentAmount.toFixed(2)} ×{" "}
                        {customer.numberOfInstallments}{" "}
                        {t("customers.installments")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          customer.customerPaymentStatus
                        )}`}
                      >
                        {getStatusLabel(customer.customerPaymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {t("customers.start")}: {formatDate(customer.startDate)}
                      </div>
                      <div>
                        {t("customers.end")}: {formatDate(customer.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          {t("customers.view")}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleDelete(customer.id, customer.fullName)
                          }
                          isLoading={deleteCustomer.isPending}
                        >
                          {t("customers.delete")}
                        </Button>
                      </div>
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
    </div>
  );
}
