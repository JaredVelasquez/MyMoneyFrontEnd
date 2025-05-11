import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowsUpDownIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import { formatCurrency, formatDate } from '../../helpers/formatters';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  category?: {
    id: string;
    name: string;
  };
  payment_method?: {
    id: string;
    name: string;
  };
  currency?: {
    id: string;
    symbol: string;
    code: string;
  };
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const TransactionTable = ({ transactions, onDelete, isLoading = false }: TransactionTableProps) => {
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    // Para las propiedades anidadas como category.name y payment_method.name, necesitamos manejo especial
    if (sortField === 'category') {
      const aName = a.category?.name?.toLowerCase() || '';
      const bName = b.category?.name?.toLowerCase() || '';
      return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
    }
    
    if (sortField === 'payment_method') {
      const aName = a.payment_method?.name?.toLowerCase() || '';
      const bName = b.payment_method?.name?.toLowerCase() || '';
      return sortDirection === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
    }
    
    const aValue = String(a[sortField] || '').toLowerCase();
    const bValue = String(b[sortField] || '').toLowerCase();
    
    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Pagination
  const paginatedTransactions = sortedTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-blue-600" />
      : <ChevronDownIcon className="w-4 h-4 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded w-full mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Fecha {getSortIcon('date')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1">
                  Descripción {getSortIcon('description')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Categoría {getSortIcon('category')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('payment_method')}
              >
                <div className="flex items-center gap-1">
                  Método de Pago {getSortIcon('payment_method')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  Monto {getSortIcon('amount')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category?.name || 'Sin categoría'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.payment_method?.name || 'No especificado'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency?.symbol || '$')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/transactions/${transaction.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/transactions/${transaction.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron transacciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {transactions.length > itemsPerPage && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(page * itemsPerPage, transactions.length)}
                </span>{' '}
                de <span className="font-medium">{transactions.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Primera</span>
                  Primera
                </button>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  Anterior
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {page} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  Siguiente
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Última</span>
                  Última
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable; 