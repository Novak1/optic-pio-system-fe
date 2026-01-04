import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Modal } from "../components/ui";
import { useCreatePayment } from "../hooks/usePayments";
import { useCustomers } from "../hooks/useCustomers";
import { useTranslation } from "../hooks/useTranslation";
import { ROUTES } from "../routes/routes";

export default function CreatePaymentPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createPayment = useCreatePayment();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const { data: customers, isLoading: loadingCustomers } = useCustomers({
    search: debouncedSearch,
  });

  const [formData, setFormData] = useState({
    customerId: "",
    amountPaid: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    installmentNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Show dropdown when searching
  useEffect(() => {
    if (searchTerm && !formData.customerId) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, customers, formData.customerId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = t("payments.validation.customerRequired");
    }

    if (formData.amountPaid <= 0) {
      newErrors.amountPaid = t("payments.validation.amountPaidPositive");
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = t("payments.validation.paymentDateRequired");
    }

    if (
      formData.installmentNumber &&
      parseInt(formData.installmentNumber) < 1
    ) {
      newErrors.installmentNumber = t(
        "payments.validation.installmentNumberMin"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Build the payment data payload
      const paymentData: any = {
        amountPaid: formData.amountPaid,
        paymentDate: new Date(formData.paymentDate).toISOString(),
      };

      // Only include optional fields if provided
      if (formData.installmentNumber) {
        paymentData.installmentNumber = parseInt(formData.installmentNumber);
      }

      if (formData.notes) {
        paymentData.notes = formData.notes;
      }

      await createPayment.mutateAsync({
        customerId: parseInt(formData.customerId),
        data: paymentData,
      });

      // Get customer name for success message
      const customer = customers?.data.find(
        (c) => c.id.toString() === formData.customerId
      );
      const customerName = customer?.fullName || "customer";

      // Show success modal
      setModalType("success");
      setModalMessage(
        t("payments.createSuccessMessage", {
          amount: formData.amountPaid,
          customer: customerName,
        })
      );
      setShowModal(true);
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = t("payments.createFailed");
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show error modal
      setModalType("error");
      setModalMessage(errorMessage);
      setShowModal(true);
    }
  };

  const handleCustomerSelect = (customerId: number, customerName: string) => {
    setFormData((prev) => ({
      ...prev,
      customerId: customerId.toString(),
    }));
    setSelectedCustomerName(customerName);
    setSearchTerm("");
    setShowDropdown(false);

    // Clear error for customer field
    if (errors.customerId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customerId;
        return newErrors;
      });
    }
  };

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear selection if user starts typing again
    if (formData.customerId) {
      setFormData((prev) => ({
        ...prev,
        customerId: "",
      }));
      setSelectedCustomerName("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const selectedCustomer = customers?.data.find(
    (c) => c.id.toString() === formData.customerId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("payments.createNewPayment")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("payments.recordPaymentFor")}
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate(ROUTES.PAYMENTS)}>
          {t("common.cancel")}
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("payments.customerInformation")}
            </h2>

            {/* Searchable Customer Input */}
            <div className="relative">
              <label
                htmlFor="customerId"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                {t("payments.selectCustomer")} *
              </label>
              <input
                id="customerId"
                name="customerId"
                type="text"
                value={selectedCustomerName || searchTerm}
                onChange={handleCustomerInputChange}
                placeholder={t("customers.searchPlaceholder")}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                required
                autoComplete="off"
              />

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {loadingCustomers ? (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {t("payments.loadingCustomers")}
                    </div>
                  ) : customers?.data.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      No customers found matching "{searchTerm}"
                    </div>
                  ) : (
                    customers?.data.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() =>
                          handleCustomerSelect(
                            customer.id,
                            `${customer.fullName} - ${customer.company}`
                          )
                        }
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="text-gray-900 dark:text-white font-medium">
                          {customer.fullName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.company} • Total Debt: {customer.totalDebt}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-medium">
                  {errors.customerId}
                </p>
              )}
            </div>

            {/* Customer Details Display */}
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payments.customerDetails")}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">
                      {t("customers.status")}:
                    </span>{" "}
                    <span
                      className={
                        selectedCustomer.customerPaymentStatus === "paid"
                          ? "text-success-600 dark:text-success-400"
                          : selectedCustomer.customerPaymentStatus ===
                            "inProgress"
                          ? "text-warning-600 dark:text-warning-400"
                          : "text-danger-600 dark:text-danger-400"
                      }
                    >
                      {selectedCustomer.customerPaymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("customers.totalDebt")}:
                    </span>{" "}
                    {selectedCustomer.totalDebt}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("customers.installments")}:
                    </span>{" "}
                    {selectedCustomer.numberOfInstallments}
                  </div>
                  <div>
                    <span className="font-medium">
                      {t("customers.installmentAmount")}:
                    </span>{" "}
                    {selectedCustomer.installmentAmount}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("payments.paymentDetails")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`${t("payments.amountPaid")} *`}
                name="amountPaid"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amountPaid || ""}
                onChange={handleChange}
                error={errors.amountPaid}
                placeholder="0.00"
                required
              />
              <Input
                label={`${t("payments.paymentDate")} *`}
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
                error={errors.paymentDate}
                required
              />
              <Input
                label={t("payments.installmentNumber")}
                name="installmentNumber"
                type="number"
                min="1"
                value={formData.installmentNumber}
                onChange={handleChange}
                error={errors.installmentNumber}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              {t("payments.notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              maxLength={255}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
              placeholder={t("payments.notesPlaceholder")}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("payments.charactersCount", { count: formData.notes.length })}
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-red-800 dark:text-red-400 text-sm font-medium">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.PAYMENTS)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createPayment.isPending}
              disabled={!formData.customerId}
            >
              {t("payments.createPayment")}
            </Button>
          </div>
        </form>
      </Card>

      {/* Success/Error Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalType === "success") {
            navigate(ROUTES.PAYMENTS);
          }
        }}
        title={
          modalType === "success"
            ? t("payments.createSuccess")
            : t("common.error")
        }
      >
        <div className="space-y-4">
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              modalType === "success"
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            {modalType === "success" ? (
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0"
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
            )}
            <p
              className={`text-sm font-medium ${
                modalType === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {modalMessage}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant={modalType === "success" ? "primary" : "danger"}
              onClick={() => {
                setShowModal(false);
                if (modalType === "success") {
                  navigate(ROUTES.PAYMENTS);
                }
              }}
            >
              {t("common.close")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
