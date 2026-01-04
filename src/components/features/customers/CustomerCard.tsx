import { Card } from "@components/ui";

interface Customer {
  id: number;
  fullName: string;
  jmbg: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {customer.fullName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">JMBG: {customer.jmbg}</p>
          {customer.email && (
            <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
          )}
          {customer.phone && (
            <p className="text-sm text-gray-600 mt-1">{customer.phone}</p>
          )}
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
