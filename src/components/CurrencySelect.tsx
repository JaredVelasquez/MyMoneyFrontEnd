import React, { useState, useEffect } from 'react';
import { CurrencyService } from '../services/currency.service';
import type { Currency } from '../types';

interface CurrencySelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  label?: string;
  className?: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  label,
  className = '',
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('CurrencySelect - Iniciando carga de monedas');
        const currencyService = new CurrencyService();
        const response = await currencyService.getActiveCurrencies();
        
        // Verificar y depurar la respuesta
        console.log('CurrencySelect - Respuesta del servicio:', JSON.stringify(response, null, 2));
        console.log('CurrencySelect - Estado HTTP:', response.status);
        
        if (Array.isArray(response.data)) {
          console.log(`CurrencySelect - Se encontraron ${response.data.length} monedas`);
          setCurrencies(response.data);
        } else {
          console.error('CurrencySelect - La respuesta no es un array:', response.data);
          setCurrencies([]);
          setError('Error al cargar las monedas: formato de respuesta inválido');
        }
      } catch (err) {
        console.error('CurrencySelect - Error al cargar las monedas:', err);
        
        // Detallar el error para depuración
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as any;
          console.error('CurrencySelect - Detalles del error:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          });
        }
        
        setError('Error al cargar las monedas. Por favor, inténtalo de nuevo más tarde.');
        setCurrencies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Crear datos de ejemplo si no hay monedas
  useEffect(() => {
    if (!isLoading && currencies.length === 0 && !error) {
      console.log('CurrencySelect - Generando monedas de ejemplo');
      
      // Datos de ejemplo para desarrollo
      const sampleCurrencies: Currency[] = [
        {
          id: '1',
          code: 'USD',
          name: 'Dólar estadounidense',
          symbol: '$',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          code: 'MXN',
          name: 'Peso mexicano',
          symbol: '$',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setCurrencies(sampleCurrencies);
    }
  }, [isLoading, currencies.length, error]);

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
        <option value="">Seleccionar moneda</option>
        {isLoading ? (
          <option disabled>Cargando...</option>
        ) : error ? (
          <option disabled>Error al cargar las monedas</option>
        ) : (
          currencies
            .filter(currency => currency.is_active)
            .map(currency => (
              <option key={currency.id} value={currency.id}>
                {currency.code} - {currency.name} ({currency.symbol})
              </option>
            ))
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!isLoading && currencies.length === 0 && !error && (
        <p className="mt-1 text-sm text-amber-600">
          No se encontraron monedas. Por favor, contacta al administrador.
        </p>
      )}
    </div>
  );
};

export default CurrencySelect; 