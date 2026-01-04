import { Card } from "@components/ui";
import { formatCurrency, formatDate } from "@utils/format";

interface Payment {
  id: number;
  customerId: number;
  amountPaid: number;
  paymentDate: string;
  notes?: string;
  createdAt: string;
}

interface PaymentCardProps {
  payment: Payment;
  customerName?: string;
}

export default function PaymentCard({
  payment,
  customerName,
}: PaymentCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {customerName && (
            <p className="text-sm font-medium text-gray-600 mb-1">
              {customerName}
            </p>
          )}
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(payment.amountPaid)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatDate(payment.paymentDate)}
          </p>
          {payment.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">{payment.notes}</p>
          )}
        </div>
        <div className="p-2 bg-green-100 rounded-lg">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
