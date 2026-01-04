import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "../components/ui";
import { useCustomer, useDeleteCustomer } from "../hooks/useCustomers";
import { useCustomerPayments, useDeletePayment } from "../hooks/usePayments";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../routes/routes";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const customerId = parseInt(id || "0");

  const {
    data: customer,
    isLoading: loadingCustomer,
    isError: customerError,
  } = useCustomer(customerId);
  const { data: payments, isLoading: loadingPayments } =
    useCustomerPayments(customerId);
  const deleteCustomer = useDeleteCustomer();
  const deletePayment = useDeletePayment();

  const handleDeleteCustomer = async () => {
    if (
      window.confirm(
        t("customers.deleteConfirm", { name: customer?.fullName || "" })
      )
    ) {
      try {
        await deleteCustomer.mutateAsync(customerId);
        navigate(ROUTES.CUSTOMERS);
      } catch (error) {
        alert(t("customers.deleteFailed"));
      }
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (window.confirm(t("payments.deleteConfirm"))) {
      try {
        await deletePayment.mutateAsync(paymentId);
      } catch (error) {
        alert(t("payments.deleteFailed"));
      }
    }
  };

  const getStatusColor = (status: string) => {
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
      month: "long",
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

  // Calculate payment statistics
  const totalPaid = payments?.reduce((sum, p) => sum + p.amountPaid, 0) || 0;
  const isPaid = customer?.customerPaymentStatus === "paid";
  const rDebt = (customer?.totalDebt && customer?.totalDebt - totalPaid) || 0;
  const remainingDebt = isPaid ? 0 : rDebt;

  if (loadingCustomer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-12">
            <p className="text-danger-600 dark:text-danger-400 font-medium">
              {t("customers.customerNotFound")}
            </p>
            <Button className="mt-4" onClick={() => navigate(ROUTES.CUSTOMERS)}>
              {t("customers.backToCustomers")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {customer.fullName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("customers.customerDetails")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTES.CUSTOMERS)}>
            {t("common.back")}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteCustomer}
            isLoading={deleteCustomer.isPending}
          >
            {t("customers.deleteCustomer")}
          </Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t("customers.personalInformation")}
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.id")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.fullName")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.company")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.company}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.jmbg")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.jmbg}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.phoneNumber")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.phoneNumber}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t("customers.paymentInformation")}
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.paymentStatus")}
              </p>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  customer.customerPaymentStatus
                )}`}
              >
                {getStatusLabel(customer.customerPaymentStatus)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.totalDebt")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                ${customer.totalDebt.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.installmentAmount")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                ${customer.installmentAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.numberOfInstallments")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {customer.numberOfInstallments}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.contractPeriod")}
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatDate(customer.startDate)} -{" "}
                {formatDate(customer.endDate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("customers.paymentProgress")}
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.totalPaid")}
              </p>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                ${totalPaid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("customers.remaining")}
              </p>
              <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                ${remainingDebt.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {customer.notes && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t("customers.notes")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{customer.notes}</p>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("customers.paymentHistory")}
          </h2>
          <Button size="sm" onClick={() => navigate(ROUTES.CREATE_PAYMENT)}>
            {t("customers.addPayment")}
          </Button>
        </div>

        {loadingPayments ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : !payments || payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {t("customers.noPaymentsRecorded")}
            </p>
            <Button
              className="mt-4"
              size="sm"
              onClick={() => navigate(ROUTES.CREATE_PAYMENT)}
            >
              {t("customers.recordFirstPayment")}
            </Button>
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
                    {t("payments.amount")}
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
                        onClick={() => handleDeletePayment(payment.id)}
                        isLoading={deletePayment.isPending}
                      >
                        {t("payments.delete")}
                      </Button>
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
