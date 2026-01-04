import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Customer, CreateCustomerDto, UpdateCustomerDto, PaginatedResult, PaginationOptions } from '../types/api';

// Get all customers with pagination
export function useCustomers(options?: PaginationOptions) {
  const page = options?.page ?? 1;
  const orderBy = options?.orderBy ?? 'createdAt';
  const orderDirection = options?.orderDirection ?? 'asc';
  const search = options?.search;

  return useQuery({
    queryKey: ['customers', { page, orderBy, orderDirection, search }],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('orderBy', orderBy);
      params.append('orderDirection', orderDirection);
      if (search) {
        params.append('search', search);
      }

      return apiClient.get<PaginatedResult<Customer>>(`/customers?${params.toString()}`);
    },
  });
}

// Get single customer by ID
export function useCustomer(id: number) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => apiClient.get<Customer>(`/customers/${id}`),
    enabled: !!id,
  });
}

// Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) =>
      apiClient.post<Customer, CreateCustomerDto>('/customers', data),
    onSuccess: async () => {
      // Invalidate and refetch customers list - wait for refetch to complete
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerDto }) =>
      apiClient.patch<Customer, UpdateCustomerDto>(`/customers/${id}`, data),
    onSuccess: async (updatedCustomer) => {
      // Update the specific customer in cache
      queryClient.setQueryData(['customers', updatedCustomer.id], updatedCustomer);
      // Invalidate customers list - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/customers/${id}`),
    onSuccess: async () => {
      // Invalidate customers list - wait for refetch
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
