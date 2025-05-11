import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import TransactionNew from '../pages/TransactionNew';
import TransactionForm from '../pages/TransactionForm';
import AITransaction from '../pages/AITransaction';
import Reports from '../pages/Reports';
import Currencies from '../pages/Currencies';
import Account from '../pages/Account';
import Premium from '../pages/Premium';
import Support from '../pages/Support';
import Landing from '../pages/Landing';

// Crear un cliente QueryClient para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Componente para rutas protegidas (solo accesibles si está autenticado)
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// Componente para rutas públicas (solo accesibles si NO está autenticado)
const PublicRoute = ({ element }: { element: React.ReactNode }) => {
  return !isAuthenticated() ? element : <Navigate to="/dashboard" />;
};

// Configuración de rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <PublicRoute element={<Login />} />,
  },
  {
    path: '/register',
    element: <PublicRoute element={<Register />} />,
  },
  // Rutas protegidas
  {
    path: '/dashboard',
    element: <ProtectedRoute element={<Dashboard />} />,
  },
  {
    path: '/transactions',
    element: <ProtectedRoute element={<Transactions />} />,
  },
  {
    path: '/transactions/new',
    element: <ProtectedRoute element={<TransactionNew />} />,
  },
  {
    path: '/transactions/new/form',
    element: <ProtectedRoute element={<TransactionForm />} />,
  },
  {
    path: '/transactions/new/ai',
    element: <ProtectedRoute element={<AITransaction />} />,
  },
  {
    path: '/reports',
    element: <ProtectedRoute element={<Reports />} />,
  },
  {
    path: '/currencies',
    element: <ProtectedRoute element={<Currencies />} />,
  },
  {
    path: '/account',
    element: <ProtectedRoute element={<Account />} />,
  },
  {
    path: '/premium',
    element: <ProtectedRoute element={<Premium />} />,
  },
  {
    path: '/support',
    element: <ProtectedRoute element={<Support />} />,
  },
]);

const AppRouter = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default AppRouter; 