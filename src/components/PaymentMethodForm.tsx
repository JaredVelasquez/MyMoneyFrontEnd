import React, { useState } from 'react';
import { PaymentMethodService } from '../services/paymentMethod.service';
import type { PaymentMethod, CreatePaymentMethodRequest, UpdatePaymentMethodRequest } from '../types';

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
  onSuccess: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  paymentMethod,
  onSuccess,
  onCancel
}) => {
  const isEdit = !!paymentMethod;
  const [formData, setFormData] = useState<CreatePaymentMethodRequest | UpdatePaymentMethodRequest>({
    name: paymentMethod?.name || '',
    description: paymentMethod?.description || '',
    ...(isEdit ? { is_active: paymentMethod?.is_active } : {})
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Manejar checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const paymentMethodService = new PaymentMethodService();
      let response;
      
      console.log(`PaymentMethodForm - ${isEdit ? 'Actualizando' : 'Creando'} método de pago:`, formData);
      
      if (isEdit && paymentMethod) {
        response = await paymentMethodService.updatePaymentMethod(
          paymentMethod.id, 
          formData as UpdatePaymentMethodRequest
        );
      } else {
        response = await paymentMethodService.createPaymentMethod(
          formData as CreatePaymentMethodRequest
        );
      }
      
      console.log(`PaymentMethodForm - Método de pago ${isEdit ? 'actualizado' : 'creado'} con éxito:`, response.data);
      
      onSuccess(response.data);
    } catch (err) {
      console.error(`PaymentMethodForm - Error al ${isEdit ? 'actualizar' : 'crear'} método de pago:`, err);
      
      // Detallar el error para depuración
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('PaymentMethodForm - Detalles del error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
        
        // Mostrar mensaje de error del servidor si está disponible
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError(`Error al ${isEdit ? 'actualizar' : 'crear'} el método de pago. Por favor, inténtalo de nuevo.`);
        }
      } else {
        setError(`Error al ${isEdit ? 'actualizar' : 'crear'} el método de pago. Por favor, inténtalo de nuevo.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Editar método de pago' : 'Nuevo método de pago'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isLoading}
        />
      </div>
      
      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={(formData as UpdatePaymentMethodRequest).is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Activo
          </label>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default PaymentMethodForm; 