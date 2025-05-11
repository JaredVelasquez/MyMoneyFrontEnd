import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import PaymentMethodTable from '../components/settings/PaymentMethodTable';
import PaymentMethodForm from '../components/settings/PaymentMethodForm';
import { PaymentMethodService } from '../services/payment-method.service';
import type { PaymentMethod } from '../types';

const PaymentMethods = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const queryClient = useQueryClient();
  const paymentMethodService = new PaymentMethodService();

  // Consultar métodos de pago
  const { data: paymentMethods, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await paymentMethodService.getAll();
      return response.data;
    }
  });

  // Crear método de pago
  const createPaymentMethodMutation = useMutation({
    mutationFn: (paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => 
      paymentMethodService.create(paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setIsFormOpen(false);
    }
  });

  // Actualizar método de pago
  const updatePaymentMethodMutation = useMutation({
    mutationFn: (params: { id: string; paymentMethod: Partial<PaymentMethod> }) => 
      paymentMethodService.update(params.id, params.paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setIsFormOpen(false);
      setSelectedPaymentMethod(null);
    }
  });

  // Eliminar método de pago
  const deletePaymentMethodMutation = useMutation({
    mutationFn: (id: string) => paymentMethodService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    }
  });

  const handleCreatePaymentMethod = () => {
    setSelectedPaymentMethod(null);
    setIsFormOpen(true);
  };

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsFormOpen(true);
  };

  const handleDeletePaymentMethod = (id: string) => {
    deletePaymentMethodMutation.mutate(id);
  };

  const handleFormSubmit = (paymentMethodData: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedPaymentMethod) {
      updatePaymentMethodMutation.mutate({
        id: selectedPaymentMethod.id,
        paymentMethod: paymentMethodData
      });
    } else {
      createPaymentMethodMutation.mutate(paymentMethodData);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedPaymentMethod(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Métodos de Pago</h1>
          <p className="text-gray-600 mt-1">
            Administra los métodos de pago que utilizas en tus transacciones
          </p>
        </div>

        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>Error al cargar los métodos de pago: {(error as Error).message}</p>
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
              <PaymentMethodForm 
                paymentMethod={selectedPaymentMethod || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isSubmitting={createPaymentMethodMutation.isPending || updatePaymentMethodMutation.isPending}
              />
            </div>
          </div>
        ) : null}

        <PaymentMethodTable 
          paymentMethods={paymentMethods || []}
          onEdit={handleEditPaymentMethod}
          onDelete={handleDeletePaymentMethod}
          onCreate={handleCreatePaymentMethod}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentMethods; 