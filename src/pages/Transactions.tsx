import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import TransactionTable from '../components/transactions/TransactionTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionService } from '../services/transaction.service';

const Transactions = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const queryClient = useQueryClient();
  const transactionService = new TransactionService();

  // Consultar transacciones
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await transactionService.getAll();
      return response.data;
    }
  });

  // Mutación para eliminar una transacción
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      // Invalidar y volver a cargar
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      deleteTransactionMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transacciones</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filtrar</span>
            </button>
            <button
              onClick={() => refetch()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Refrescar"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <Link 
              to="/transactions/new" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Nueva Transacción</span>
            </Link>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtros: Fecha, Categoría, Tipo, etc. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Todas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="">Todos</option>
                  <option value="EXPENSE">Gastos</option>
                  <option value="INCOME">Ingresos</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
        
        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error al cargar las transacciones: {(error as Error).message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <TransactionTable 
            transactions={data || []}
            onDelete={handleDeleteTransaction}
            isLoading={isLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions; 