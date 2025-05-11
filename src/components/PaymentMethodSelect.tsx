import React, { useState, useEffect } from 'react';
import { PaymentMethodService } from '../services/paymentMethod.service';
import type { PaymentMethod } from '../types';

interface PaymentMethodSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  label?: string;
  className?: string;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  label,
  className = '',
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('PaymentMethodSelect - Iniciando carga de métodos de pago');
        const paymentMethodService = new PaymentMethodService();
        const response = await paymentMethodService.getPaymentMethods();
        
        // Verificar y depurar la respuesta
        console.log('PaymentMethodSelect - Respuesta del servicio:', JSON.stringify(response, null, 2));
        console.log('PaymentMethodSelect - Estado HTTP:', response.status);
        console.log('PaymentMethodSelect - Headers:', JSON.stringify(response.headers, null, 2));
        
        if (Array.isArray(response.data)) {
          console.log(`PaymentMethodSelect - Se encontraron ${response.data.length} métodos de pago`);
          
          // Filtrar métodos activos para depuración
          const activePaymentMethods = response.data.filter(method => method.is_active);
          console.log(`PaymentMethodSelect - De los cuales ${activePaymentMethods.length} están activos`);
          
          setPaymentMethods(response.data);
        } else {
          console.error('PaymentMethodSelect - La respuesta no es un array:', response.data);
          setPaymentMethods([]);
          setError('Error al cargar los métodos de pago: formato de respuesta inválido');
        }
      } catch (err) {
        console.error('PaymentMethodSelect - Error al cargar los métodos de pago:', err);
        
        // Detallar el error para depuración
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as any;
          console.error('PaymentMethodSelect - Detalles del error:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          });
        }
        
        setError('Error al cargar los métodos de pago. Por favor, inténtalo de nuevo más tarde.');
        setPaymentMethods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Crear datos de ejemplo si no hay métodos de pago
  useEffect(() => {
    if (!isLoading && paymentMethods.length === 0 && !error) {
      console.log('PaymentMethodSelect - Generando métodos de pago de ejemplo');
      
      // Datos de ejemplo para desarrollo
      const samplePaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          name: 'Efectivo',
          description: 'Pagos en efectivo',
          is_active: true,
          user_id: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Tarjeta de crédito',
          description: 'Pagos con tarjeta de crédito',
          is_active: true,
          user_id: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Transferencia bancaria',
          description: 'Pagos por transferencia',
          is_active: true,
          user_id: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setPaymentMethods(samplePaymentMethods);
    }
  }, [isLoading, paymentMethods.length, error]);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        disabled={isLoading}
      >
        <option value="">Seleccionar método de pago</option>
        {isLoading ? (
          <option disabled>Cargando...</option>
        ) : error ? (
          <option disabled>Error al cargar los métodos de pago</option>
        ) : (
          paymentMethods
            .filter(method => method.is_active)
            .map(method => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!isLoading && paymentMethods.length === 0 && !error && (
        <p className="mt-1 text-sm text-amber-600">
          No se encontraron métodos de pago. Por favor, crea uno primero.
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelect; 