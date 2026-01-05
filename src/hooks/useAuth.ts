import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { useAuthStore } from "../stores/authStore";
import type { User, CreateUserDto, LoginDto, AuthResponse } from "../types/api";

// Get current user
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const user = await apiClient.get<User>("/users/me");
        setUser(user);
        return user;
      } catch (error) {
        clearUser();
        throw error;
      }
    },
    retry: false,
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: CreateUserDto) =>
      apiClient.post<User, CreateUserDto>("/users", data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(["user", "me"], user);
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginDto) =>
      apiClient.post<AuthResponse, LoginDto>("/users/login", data),
    onSuccess: async () => {
      // After login, fetch user data
      const user = await apiClient.get<User>("/users/me");
      setUser(user);
      queryClient.setQueryData(["user", "me"], user);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: () => apiClient.post<AuthResponse>("/users/logout", {}),
    onSuccess: async () => {
      clearUser();
      await queryClient.clear();
    },
  });
}
