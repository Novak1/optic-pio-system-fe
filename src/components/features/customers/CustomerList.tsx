import CustomerCard from "./CustomerCard";
import { Spinner } from "@components/ui";

interface Customer {
  id: number;
  fullName: string;
  jmbg: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

interface CustomerListProps {
  customers: Customer[];
  isLoading?: boolean;
  onCustomerClick?: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  isLoading,
  onCustomerClick,
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onClick={() => onCustomerClick?.(customer)}
        />
      ))}
    </div>
  );
}
