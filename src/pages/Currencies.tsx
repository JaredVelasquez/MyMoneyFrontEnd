import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import CurrencyTable from '../components/settings/CurrencyTable';
import CurrencyForm from '../components/settings/CurrencyForm';
import { CurrencyService } from '../services/currency.service';
import type { Currency } from '../types';

const Currencies = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const queryClient = useQueryClient();
  const currencyService = new CurrencyService();

  // Consultar monedas
  const { data: currencies, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await currencyService.getAll();
      return response.data;
    }
  });

  // Crear moneda
  const createCurrencyMutation = useMutation({
    mutationFn: (currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => 
      currencyService.create(currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setIsFormOpen(false);
    }
  });

  // Actualizar moneda
  const updateCurrencyMutation = useMutation({
    mutationFn: (params: { id: string; currency: Partial<Currency> }) => 
      currencyService.update(params.id, params.currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setIsFormOpen(false);
      setSelectedCurrency(null);
    }
  });

  // Eliminar moneda
  const deleteCurrencyMutation = useMutation({
    mutationFn: (id: string) => currencyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
    }
  });

  const handleCreateCurrency = () => {
    setSelectedCurrency(null);
    setIsFormOpen(true);
  };

  const handleEditCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsFormOpen(true);
  };

  const handleDeleteCurrency = (id: string) => {
    deleteCurrencyMutation.mutate(id);
  };

  const handleFormSubmit = (currencyData: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedCurrency) {
      updateCurrencyMutation.mutate({
        id: selectedCurrency.id,
        currency: currencyData
      });
    } else {
      createCurrencyMutation.mutate(currencyData);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedCurrency(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Monedas</h1>
          <p className="text-gray-600 mt-1">
            Administra las monedas que utilizas en tus transacciones
          </p>
        </div>

        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>Error al cargar las monedas: {(error as Error).message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : null}

        {isFormOpen ? (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="max-w-md w-full">
              <CurrencyForm 
                currency={selectedCurrency || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isSubmitting={createCurrencyMutation.isPending || updateCurrencyMutation.isPending}
              />
            </div>
          </div>
        ) : null}

        <CurrencyTable 
          currencies={currencies || []}
          onEdit={handleEditCurrency}
          onDelete={handleDeleteCurrency}
          onCreate={handleCreateCurrency}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Currencies; 