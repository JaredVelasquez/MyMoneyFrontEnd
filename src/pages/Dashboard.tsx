import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCards from '../components/dashboard/StatCards';
import type { StatCardData } from '../components/dashboard/StatCards';
import TransactionList from '../components/dashboard/TransactionList';
import type { Transaction } from '../components/dashboard/TransactionList';
import StatsSummary from '../components/dashboard/StatsSummary';
import ExpenseDistribution from '../components/dashboard/ExpenseDistribution';
import type { ExpenseCategory } from '../components/dashboard/ExpenseDistribution';
import { BellIcon, PlusIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { TransactionService } from '../services/transaction.service';
import { formatCurrency } from '../helpers/formatters';

// Interfaz para el resumen del dashboard
interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  balanceChange?: number;
  incomeChange?: number;
  expenseChange?: number;
  savingsChange?: number;
  expensePercentage: number;
  expenseCategories: ExpenseCategory[];
  recentTransactions: Transaction[];
}

const Dashboard = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();
  const transactionService = new TransactionService();

  // Cargar datos del dashboard
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      try {
        const response = await transactionService.getSummary();
        const data = response.data;
        
        // Transformar los datos al formato esperado
        return {
          totalBalance: data.balance || 0,
          totalIncome: data.totalIncome || 0,
          totalExpenses: data.totalExpense || 0,
          monthlyIncome: data.totalIncome || 0,
          monthlyExpenses: data.totalExpense || 0,
          monthlySavings: (data.totalIncome || 0) - (data.totalExpense || 0),
          expensePercentage: data.totalIncome ? ((data.totalExpense || 0) / data.totalIncome) * 100 : 0,
          expenseCategories: (data.expenseByCategory || []).map((cat: any) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            amount: cat.amount,
            percentage: cat.percentage,
            color: `bg-${getColorForCategory(cat.categoryName)}-500`
          })),
          recentTransactions: (data.recentTransactions || []).map((tx: any) => ({
            id: tx.id,
            description: tx.description,
            amount: tx.amount,
            date: tx.date,
            isIncome: tx.type === 'INCOME',
            category: tx.category ? {
              id: tx.category.id,
              name: tx.category.name,
              icon: tx.category.icon || '📝'
            } : undefined,
            paymentMethod: tx.paymentMethod ? {
              id: tx.paymentMethod.id,
              name: tx.paymentMethod.name
            } : undefined
          }))
        };
      } catch (error) {
        console.error('Error al cargar los datos del dashboard:', error);
        throw error;
      }
    }
  });

  // Función para asignar colores a las categorías
  const getColorForCategory = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      'Alimentación': 'blue',
      'Transporte': 'green',
      'Entretenimiento': 'purple',
      'Servicios': 'yellow',
      'Salud': 'red',
      'Educación': 'indigo',
      'Vivienda': 'pink',
      'Otros': 'gray'
    };
    
    return colorMap[categoryName] || 'blue';
  };

  // Al cargar el componente, simular notificaciones
  useEffect(() => {
    setHasNotifications(Math.random() > 0.5);
  }, []);

  // Manejadores de eventos
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementar búsqueda
  };

  const handleNotificationsClick = () => {
    setHasNotifications(false);
    // Mostrar notificaciones
  };

  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  const handleAddIncome = () => {
    navigate('/transactions/new?type=income');
  };

  const handleAddExpense = () => {
    navigate('/transactions/new?type=expense');
  };

  // Preparar las estadísticas para mostrar
  const stats: StatCardData[] = isLoading || !data ? [] : [
    {
      id: 'balance',
      title: 'Balance total',
      value: formatCurrency(data.totalBalance),
      change: data.balanceChange ? {
        value: `${Math.abs(data.balanceChange).toFixed(1)}%`,
        isPositive: data.balanceChange > 0,
        text: 'desde el mes pasado'
      } : undefined
    },
    {
      id: 'income',
      title: 'Ingresos del mes',
      value: formatCurrency(data.monthlyIncome),
      change: data.incomeChange ? {
        value: `${Math.abs(data.incomeChange).toFixed(1)}%`,
        isPositive: data.incomeChange > 0,
        text: 'desde el mes pasado'
      } : undefined
    },
    {
      id: 'expenses',
      title: 'Gastos del mes',
      value: formatCurrency(data.monthlyExpenses),
      change: data.expenseChange ? {
        value: `${Math.abs(data.expenseChange).toFixed(1)}%`,
        isPositive: data.expenseChange < 0, // A negative change in expenses is positive
        text: 'desde el mes pasado'
      } : undefined
    },
    {
      id: 'savings',
      title: 'Ahorro del mes',
      value: formatCurrency(data.monthlySavings),
      change: data.savingsChange ? {
        value: `${Math.abs(data.savingsChange).toFixed(1)}%`,
        isPositive: data.savingsChange > 0,
        text: 'desde el mes pasado'
      } : undefined
    }
  ];

  // Si hay error, mostrar mensaje
  if (error) {
    console.error('Error al cargar los datos del dashboard:', error);
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Una visión general de tus finanzas</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <BellIcon className="h-6 w-6" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-100 rounded-full py-2 pl-4 pr-10 w-40 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCards stats={stats} isLoading={isLoading} />

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <button
          onClick={handleAddTransaction}
          className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Transacción
        </button>
        <button
          onClick={handleAddIncome}
          className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200"
        >
          <ArrowUpIcon className="h-5 w-5 mr-2" />
          Nuevo Ingreso
        </button>
        <button
          onClick={handleAddExpense}
          className="flex items-center justify-center bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Nuevo Gasto
        </button>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <StatsSummary 
            incomeStat={{
              amount: data?.totalIncome || 0,
              percentage: 100
            }}
            expenseStat={{
              amount: data?.totalExpenses || 0,
              percentage: data?.expensePercentage || 0
            }}
            isLoading={isLoading}
          />
          <div className="mt-8">
            <ExpenseDistribution 
              categories={data?.expenseCategories || []}
              isLoading={isLoading} 
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <TransactionList 
            transactions={data?.recentTransactions || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 