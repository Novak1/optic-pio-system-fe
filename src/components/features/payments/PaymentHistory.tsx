import PaymentCard from "./PaymentCard";
import { Spinner } from "@components/ui";

interface Payment {
  id: number;
  customerId: number;
  amountPaid: number;
  paymentDate: string;
  notes?: string;
  createdAt: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading?: boolean;
  showCustomerName?: boolean;
  getCustomerName?: (customerId: number) => string;
}

export default function PaymentHistory({
  payments,
  isLoading,
  showCustomerName,
  getCustomerName,
}: PaymentHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No payment history found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          customerName={
            showCustomerName && getCustomerName
              ? getCustomerName(payment.customerId)
              : undefined
          }
        />
      ))}
    </div>
  );
}
