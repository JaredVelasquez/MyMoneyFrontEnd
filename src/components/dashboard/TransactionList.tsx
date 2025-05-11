import { useState } from 'react';
import TransactionItem from '../ui/TransactionItem';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  isIncome: boolean;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  paymentMethod?: {
    id: string;
    name: string;
  };
}

interface TransactionListProps {
  title?: string;
  transactions: Transaction[];
  isLoading?: boolean;
}

const TransactionList = ({ 
  title = "Actividad Reciente", 
  transactions,
  isLoading = false
}: TransactionListProps) => {
  const [timeFilter, setTimeFilter] = useState('7days');

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
          <div className="animate-pulse w-24 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 mb-4 px-2">
          <span className="col-span-1">Transacción</span>
          <span className="col-span-1 text-center">Fecha</span>
          <span className="col-span-1 text-right">Monto</span>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex justify-between py-3 border-b border-gray-100">
            <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
            <div className="w-1/5 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Si no hay transacciones
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="py-8 text-center text-gray-500">
          <p>No hay transacciones para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">{title}</h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm border-0 focus:ring-2 focus:ring-blue-500"
        >
          <option value="7days">Últimos 7 días</option>
          <option value="month">Este mes</option>
          <option value="3months">Últimos 3 meses</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 mb-4 px-2">
        <span className="col-span-1">Transacción</span>
        <span className="col-span-1 text-center">Fecha</span>
        <span className="col-span-1 text-right">Monto</span>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <TransactionItem 
            key={transaction.id}
            icon={transaction.category?.icon || '💰'}
            description={transaction.description}
            category={transaction.category?.name || 'Sin categoría'}
            date={transaction.date}
            amount={transaction.amount.toString()}
            isIncome={transaction.isIncome}
          />
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/transactions" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver todas las transacciones
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default TransactionList; 