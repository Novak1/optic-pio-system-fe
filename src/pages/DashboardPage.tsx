import { useMemo } from "react";
import { useAuthStore } from "../stores/authStore";
import { Card, Spinner } from "../components/ui";
import { useCustomers } from "../hooks/useCustomers";
import { usePayments } from "../hooks/usePayments";
import { useMonthlyStatistics } from "../hooks/useStatistics";
import { useTranslation } from "../hooks/useTranslation";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: payments, isLoading: loadingPayments } = usePayments();
  const { data: monthlyStats, isLoading: loadingStats } =
    useMonthlyStatistics();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCustomers = customers?.pagination?.totalItems || 0;
    const totalPayments = payments?.pagination?.totalItems || 0;

    // Calculate revenue for this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const revenueThisMonth =
      payments?.data
        ?.filter((payment) => {
          const paymentDate = new Date(payment.paymentDate);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, payment) => sum + payment.amountPaid, 0) || 0;

    const paymentsThisMonth =
      payments?.data?.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      }).length || 0;

    return {
      totalCustomers,
      totalPayments,
      revenueThisMonth,
      paymentsThisMonth,
    };
  }, [customers, payments]);

  const isLoading = loadingCustomers || loadingPayments;

  // Get recent payments (last 5)
  const recentPayments = useMemo(() => {
    if (!payments?.data || !customers?.data) return [];

    return [...payments.data]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((payment) => {
        const customer = customers.data.find(
          (c) => c.id === payment.customerId
        );
        return {
          ...payment,
          customerName: customer?.fullName || t("dashboard.unknownCustomer"),
          customerCompany: customer?.company || "",
        };
      });
  }, [payments, customers, t]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMonthName = (month: number) => {
    const monthKeys = [
      "months.january",
      "months.february",
      "months.march",
      "months.april",
      "months.may",
      "months.june",
      "months.july",
      "months.august",
      "months.september",
      "months.october",
      "months.november",
      "months.december",
    ];
    return t(monthKeys[month - 1]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("dashboard.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t("dashboard.welcome", { username: user?.username })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("dashboard.totalCustomers")}
              </p>
              {isLoading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalCustomers}
                </p>
              )}
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <svg
                className="w-8 h-8 text-primary-600 dark:text-primary-400"
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
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("dashboard.totalPayments")}
              </p>
              {isLoading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalPayments}
                </p>
              )}
            </div>
            <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-xl">
              <svg
                className="w-8 h-8 text-success-600 dark:text-success-400"
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
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("dashboard.revenueThisMonth")}
              </p>
              {isLoading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  ${stats.revenueThisMonth.toFixed(2)}
                </p>
              )}
            </div>
            <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-xl">
              <svg
                className="w-8 h-8 text-warning-600 dark:text-warning-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("dashboard.paymentsThisMonth")}
              </p>
              {isLoading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.paymentsThisMonth}
                </p>
              )}
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
              <svg
                className="w-8 h-8 text-secondary-600 dark:text-secondary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("dashboard.recentPayments")}
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : recentPayments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {t("dashboard.noRecentPayments")}
          </p>
        ) : (
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {payment.customerName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {payment.customerCompany}
                    {payment.installmentNumber &&
                      ` • ${t("dashboard.installment", {
                        number: payment.installmentNumber,
                      })}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success-600 dark:text-success-400">
                    ${payment.amountPaid.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Monthly Statistics */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("dashboard.monthlyStatistics")}
        </h2>
        {loadingStats ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : !monthlyStats || monthlyStats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            {t("dashboard.noMonthlyStats")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t("dashboard.month")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Očekivano
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {t("dashboard.income")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Dugovanje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {monthlyStats.map((stat, index) => (
                  <tr
                    key={`${stat.year}-${stat.month}`}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {getMonthName(stat.month)} {stat.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400 font-semibold">
                      ${stat.expectedDebt.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600 dark:text-success-400 font-semibold">
                      ${stat.income.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-danger-600 dark:text-danger-400 font-semibold">
                      ${stat.remainingDebt.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
