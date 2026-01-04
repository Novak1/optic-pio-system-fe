import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Payment, CreatePaymentDto, UpdatePaymentDto, PaginatedResult, PaginationOptions } from '../types/api';

// Get all payments with pagination
export function usePayments(options?: PaginationOptions) {
  const page = options?.page ?? 1;
  const orderBy = options?.orderBy ?? 'createdAt';
  const orderDirection = options?.orderDirection ?? 'asc';

  return useQuery({
    queryKey: ['payments', { page, orderBy, orderDirection }],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('orderBy', orderBy);
      params.append('orderDirection', orderDirection);

      return apiClient.get<PaginatedResult<Payment>>(`/payments/payments?${params.toString()}`);
    },
  });
}

// Get payments for a specific customer
export function useCustomerPayments(customerId: number) {
  return useQuery({
    queryKey: ['customers', customerId, 'payments'],
    queryFn: () =>
      apiClient.get<Payment[]>(`/payments/customers/${customerId}/payments`),
    enabled: !!customerId,
  });
}

// Get single payment by ID
export function usePayment(id: number) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => apiClient.get<Payment>(`/payments/payments/${id}`),
    enabled: !!id,
  });
}

// Create payment mutation
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: CreatePaymentDto }) =>
      apiClient.post<Payment, CreatePaymentDto>(
        `/payments/customers/${customerId}/payments`,
        data
      ),
    onSuccess: async (_, variables) => {
      // Invalidate customer's payments - wait for refetch
      await queryClient.invalidateQueries({
        queryKey: ['customers', variables.customerId, 'payments'],
      });
      // Invalidate all payments - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      // Refetch customer data (status might have changed) - wait for refetch
      await queryClient.invalidateQueries({
        queryKey: ['customers', variables.customerId],
      });
      // Also invalidate all customers list
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Update payment mutation
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentDto }) =>
      apiClient.patch<Payment, UpdatePaymentDto>(`/payments/payments/${id}`, data),
    onSuccess: async (updatedPayment) => {
      // Update payment in cache
      queryClient.setQueryData(['payments', updatedPayment.id], updatedPayment);
      // Invalidate customer's payments - wait for refetch
      await queryClient.invalidateQueries({
        queryKey: ['customers', updatedPayment.customerId, 'payments'],
      });
      // Invalidate all payments - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

// Delete payment mutation
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/payments/payments/${id}`),
    onSuccess: async () => {
      // Invalidate all payments - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      // Invalidate all customer payments (we don't know which customer) - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
