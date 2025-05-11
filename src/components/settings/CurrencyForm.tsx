import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Currency } from '../../types';

interface CurrencyFormProps {
  currency?: Currency;
  onSubmit: (currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CurrencyForm = ({ currency, onSubmit, onCancel, isSubmitting = false }: CurrencyFormProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (currency) {
      setName(currency.name || '');
      setCode(currency.code || '');
      setSymbol(currency.symbol || '');
      setIsDefault(currency.is_default || false);
    }
  }, [currency]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!code.trim()) {
      newErrors.code = 'El código es obligatorio';
    } else if (code.length !== 3) {
      newErrors.code = 'El código debe tener exactamente 3 caracteres';
    }
    
    if (!symbol.trim()) {
      newErrors.symbol = 'El símbolo es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      symbol: symbol.trim(),
      is_default: isDefault
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {currency ? 'Editar Moneda' : 'Nueva Moneda'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
          type="button"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-md shadow-sm ${
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ej: Dólar Estadounidense"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Código */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Código ISO *
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full rounded-md shadow-sm ${
                errors.code ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ej: USD"
              maxLength={3}
              style={{ textTransform: 'uppercase' }}
              disabled={isSubmitting}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Código de 3 letras según estándar ISO 4217 (Ej: USD, EUR, GBP)
            </p>
          </div>
          
          {/* Símbolo */}
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo *
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className={`w-full rounded-md shadow-sm ${
                errors.symbol ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ej: $"
              maxLength={3}
              disabled={isSubmitting}
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
            )}
          </div>
          
          {/* Moneda predeterminada */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSubmitting || (currency?.is_default && !isDefault)}
            />
            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
              Establecer como moneda predeterminada
            </label>
          </div>
          
          {currency?.is_default && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Esta es la moneda predeterminada actual. Si deseas cambiarla, primero deberás establecer otra moneda como predeterminada.
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : currency ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CurrencyForm; 