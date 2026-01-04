// Customer Types
export type CustomerPaymentStatus = "paid" | "unpaid" | "inProgress";

export interface Customer {
  id: number;
  userId: number;
  fullName: string;
  company: string;
  jmbg: string;
  phoneNumber: string;
  numberOfInstallments: number;
  installmentAmount: number;
  totalDebt: number;
  customerPaymentStatus: CustomerPaymentStatus;
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  userId: number;
  fullName: string;
  company: string;
  jmbg: string;
  phoneNumber: string;
  numberOfInstallments: number;
  installmentAmount: number;
  totalDebt: number;
  customerPaymentStatus: CustomerPaymentStatus;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  fullName?: string;
  company?: string;
  jmbg?: string;
  phoneNumber?: string;
  numberOfInstallments?: number;
  installmentAmount?: number;
  totalDebt?: number;
  customerPaymentStatus?: CustomerPaymentStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// Payment Types
export interface Payment {
  id: number;
  customerId: number;
  amountPaid: number;
  paymentDate: string; // ISO date string
  installmentNumber: number | null;
  notes: string | null;
  createdAt: string;
}

export interface CreatePaymentDto {
  amountPaid: number;
  paymentDate: string;
  installmentNumber?: number;
  notes?: string;
}

export interface UpdatePaymentDto {
  amountPaid?: number;
  paymentDate?: string;
  installmentNumber?: number;
  notes?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  userPermissionsId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

// Statistics Types
export interface MonthlyStatistic {
  year: number;
  month: number;
  income: number; // Stvarno plaćeno u tom mesecu
  expectedDebt: number; // Očekivane rate za taj mesec (koliko je trebalo da se plati)
  remainingDebt: number; // Dugovanje (expectedDebt - income)
}

// Pagination Types
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}
