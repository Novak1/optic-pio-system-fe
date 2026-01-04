# State Management Guide

This project uses **TanStack Query** (React Query) for server state and **Zustand** for client state.

## Architecture

```
┌─────────────────────────────────────────┐
│         React Components                │
│  (UI Layer - use hooks)                 │
└─────────────┬───────────────────────────┘
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│  TanStack   │  │   Zustand   │
│   Query     │  │   Stores    │
│             │  │             │
│ (Server     │  │ (Client     │
│  State)     │  │  State)     │
└──────┬──────┘  └─────────────┘
       │
       ▼
┌─────────────┐
│ API Client  │
│ (Fetch)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │
│   API       │
└─────────────┘
```

## 🗂️ Folder Structure

```
src/
├── hooks/              # TanStack Query hooks
│   ├── useAuth.ts      # Authentication queries/mutations
│   ├── useCustomers.ts # Customer queries/mutations
│   └── usePayments.ts  # Payment queries/mutations
├── stores/             # Zustand stores
│   └── authStore.ts    # Auth state (user, isAuthenticated)
├── lib/                # Utilities
│   └── api-client.ts   # API fetch wrapper
└── types/              # TypeScript types
    └── api.ts          # API DTOs and entities
```

## 📚 TanStack Query (Server State)

**Use for**: Data from the API (customers, payments, user data)

### Query Hooks

#### Customers

```tsx
import { useCustomers, useCustomer, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from './hooks/useCustomers';

function CustomersPage() {
  // Fetch all customers
  const { data, isLoading, error } = useCustomers();

  // Fetch single customer
  const { data: customer } = useCustomer(customerId);

  // Create customer
  const createCustomer = useCreateCustomer();
  createCustomer.mutate({
    fullName: "John Doe",
    jmbg: "1234567890123",
    // ... other fields
  });

  // Update customer
  const updateCustomer = useUpdateCustomer();
  updateCustomer.mutate({
    id: 1,
    data: { fullName: "Jane Doe" }
  });

  // Delete customer
  const deleteCustomer = useDeleteCustomer();
  deleteCustomer.mutate(customerId);
}
```

#### Payments

```tsx
import { usePayments, useCustomerPayments, useCreatePayment } from './hooks/usePayments';

function PaymentsPage() {
  // All payments
  const { data: allPayments } = usePayments();

  // Customer's payments
  const { data: customerPayments } = useCustomerPayments(customerId);

  // Create payment
  const createPayment = useCreatePayment();
  createPayment.mutate({
    customerId: 1,
    data: {
      amountPaid: 1000,
      paymentDate: new Date().toISOString(),
    }
  });
}
```

#### Authentication

```tsx
import { useCurrentUser, useLogin, useLogout, useRegister } from './hooks/useAuth';

function AuthExample() {
  // Get current user
  const { data: user } = useCurrentUser();

  // Login
  const login = useLogin();
  login.mutate({ username: "user", password: "pass" });

  // Logout
  const logout = useLogout();
  logout.mutate();

  // Register
  const register = useRegister();
  register.mutate({ username: "newuser", password: "pass" });
}
```

### Query Features

- ✅ **Automatic caching** - Data is cached for 5 minutes
- ✅ **Auto refetching** - Refetches on reconnect, mount
- ✅ **Loading/error states** - Built-in `isLoading`, `error`
- ✅ **Optimistic updates** - Cache invalidation on mutations
- ✅ **DevTools** - React Query DevTools included (bottom-left icon)

## 🏪 Zustand (Client State)

**Use for**: UI state, authentication status, preferences

### Auth Store

```tsx
import { useAuthStore } from './stores/authStore';

function Header() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Creating New Stores

```tsx
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

## 🔧 API Client

The `apiClient` utility handles all HTTP requests with proper error handling and cookie-based authentication.

```tsx
import { apiClient } from './lib/api-client';

// GET request
const customers = await apiClient.get<Customer[]>('/customers');

// POST request
const newCustomer = await apiClient.post<Customer, CreateCustomerDto>('/customers', {
  fullName: "John Doe",
  // ...
});

// PATCH request
const updated = await apiClient.patch<Customer, UpdateCustomerDto>('/customers/1', {
  fullName: "Jane Doe"
});

// DELETE request
await apiClient.delete('/customers/1');
```

### Features:
- ✅ Automatic cookie inclusion (`credentials: 'include'`)
- ✅ JSON serialization/deserialization
- ✅ Error handling with custom `ApiError` class
- ✅ TypeScript generics for type safety

## 🔐 Authentication Flow

1. **Login**: `useLogin()` mutation → stores user in Zustand + Query cache
2. **Persist**: Zustand persists auth state to localStorage
3. **API calls**: All requests include httpOnly cookies automatically
4. **Logout**: `useLogout()` mutation → clears all state + cache

## 🎯 Best Practices

### 1. **Use TanStack Query for server data**
```tsx
// ✅ Good - automatic caching, loading states
const { data: customers } = useCustomers();

// ❌ Bad - manual fetch in useEffect
const [customers, setCustomers] = useState([]);
useEffect(() => {
  fetch('/api/customers').then(r => r.json()).then(setCustomers);
}, []);
```

### 2. **Use Zustand for client state**
```tsx
// ✅ Good - simple client state
const darkMode = useUIStore(state => state.darkMode);

// ❌ Bad - don't use for server data
const customers = useCustomersStore(state => state.customers); // Use TanStack Query instead
```

### 3. **Invalidate queries after mutations**
```tsx
// Already handled in hooks!
const createCustomer = useCreateCustomer();
// After mutation succeeds, automatically invalidates ['customers'] query
```

### 4. **Handle loading and error states**
```tsx
const { data, isLoading, error } = useCustomers();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <CustomerList customers={data} />;
```

## 🛠️ Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 📖 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
