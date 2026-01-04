import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Modal } from "../components/ui";
import { useCreateCustomer } from "../hooks/useCustomers";
import { useTranslation } from "../hooks/useTranslation";
import { useAuthStore } from "../stores/authStore";
import type { CustomerPaymentStatus } from "../types/api";
import { ROUTES } from "../routes/routes";

export default function CreateCustomerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const createCustomer = useCreateCustomer();

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    jmbg: "",
    phoneNumber: "",
    numberOfInstallments: 1,
    installmentAmount: 0,
    totalDebt: 0,
    customerPaymentStatus: "unpaid" as CustomerPaymentStatus,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("customers.validation.fullNameRequired");
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = t("customers.validation.fullNameTooLong");
    }

    if (!formData.company.trim()) {
      newErrors.company = t("customers.validation.companyRequired");
    } else if (formData.company.length > 50) {
      newErrors.company = t("customers.validation.companyTooLong");
    }

    if (!formData.jmbg.trim()) {
      newErrors.jmbg = t("customers.validation.jmbgRequired");
    } else if (formData.jmbg.length !== 13) {
      newErrors.jmbg = t("customers.validation.jmbgInvalid");
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("customers.validation.phoneRequired");
    }

    if (formData.numberOfInstallments < 1) {
      newErrors.numberOfInstallments = t(
        "customers.validation.installmentsMin"
      );
    }

    if (formData.installmentAmount < 0) {
      newErrors.installmentAmount = t(
        "customers.validation.installmentAmountNegative"
      );
    }

    if (formData.totalDebt < 0) {
      newErrors.totalDebt = t("customers.validation.totalDebtNegative");
    }

    if (!formData.startDate) {
      newErrors.startDate = t("customers.validation.startDateRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors({ submit: t("customers.mustBeLoggedIn") });
      return;
    }

    try {
      const payload: any = {
        userId: user.id,
        fullName: formData.fullName,
        company: formData.company,
        jmbg: formData.jmbg,
        phoneNumber: formData.phoneNumber,
        numberOfInstallments: formData.numberOfInstallments,
        installmentAmount: formData.installmentAmount,
        totalDebt: formData.totalDebt,
        customerPaymentStatus: formData.customerPaymentStatus,
        startDate: new Date(formData.startDate).toISOString(),
      };

      // Only include endDate if provided
      if (formData.endDate) {
        payload.endDate = new Date(formData.endDate).toISOString();
      }

      // Only include notes if provided
      if (formData.notes) {
        payload.notes = formData.notes;
      }

      await createCustomer.mutateAsync(payload);

      // Show success modal
      setModalType("success");
      setModalMessage(
        t("customers.createSuccessMessage", { name: formData.fullName })
      );
      setShowModal(true);
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = t("customers.createFailed");
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
        [name]: parseFloat(value) || 0,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("customers.createNewCustomer")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("customers.addNewCustomer")}
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate(ROUTES.CUSTOMERS)}>
          {t("customers.cancel")}
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("customers.personalInformation")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`${t("customers.fullName")} *`}
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="John Doe"
                required
              />
              <Input
                label={`${t("customers.company")} *`}
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                error={errors.company}
                placeholder="ABC Corp"
                required
              />
              <Input
                label={`${t("customers.jmbg")} *`}
                name="jmbg"
                type="text"
                value={formData.jmbg}
                onChange={handleChange}
                error={errors.jmbg}
                placeholder="1234567890123"
                maxLength={13}
                required
              />
              <Input
                label={`${t("customers.phoneNumber")} *`}
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="+381 60 123 4567"
                required
              />
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("customers.paymentInformation")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`${t("customers.totalDebt")} *`}
                name="totalDebt"
                type="number"
                step="0.01"
                value={formData.totalDebt}
                onChange={handleChange}
                error={errors.totalDebt}
                placeholder="0.00"
                required
              />
              <Input
                label={`${t("customers.numberOfInstallments")} *`}
                name="numberOfInstallments"
                type="number"
                min="1"
                value={formData.numberOfInstallments}
                onChange={handleChange}
                error={errors.numberOfInstallments}
                placeholder="12"
                required
              />
              <Input
                label={`${t("customers.installmentAmount")} *`}
                name="installmentAmount"
                type="number"
                step="0.01"
                value={formData.installmentAmount}
                onChange={handleChange}
                error={errors.installmentAmount}
                placeholder="0.00"
                required
              />
              <div>
                <label
                  htmlFor="customerPaymentStatus"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  {t("customers.paymentStatus")} *
                </label>
                <select
                  id="customerPaymentStatus"
                  name="customerPaymentStatus"
                  value={formData.customerPaymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="unpaid">{t("customers.unpaid")}</option>
                  <option value="inProgress">
                    {t("customers.inProgress")}
                  </option>
                  <option value="paid">{t("customers.paid")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("customers.contractDates")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`${t("customers.startDate")} *`}
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={errors.startDate}
                required
              />
              <Input
                label={t("customers.endDate")}
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              {t("customers.notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
              placeholder={t("customers.notesPlaceholder")}
            />
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
              onClick={() => navigate(ROUTES.CUSTOMERS)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createCustomer.isPending}
            >
              {t("customers.createCustomer")}
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
            navigate(ROUTES.CUSTOMERS);
          }
        }}
        title={
          modalType === "success"
            ? t("customers.createSuccess")
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
                  navigate(ROUTES.CUSTOMERS);
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
