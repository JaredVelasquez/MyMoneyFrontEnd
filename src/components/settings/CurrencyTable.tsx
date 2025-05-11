import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import type { Currency } from '../../types';

interface CurrencyTableProps {
  currencies: Currency[];
  onEdit: (currency: Currency) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

const CurrencyTable = ({ currencies, onEdit, onDelete, onCreate, isLoading = false }: CurrencyTableProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta moneda?')) {
      onDelete(id);
    }
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
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Monedas</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Moneda</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Símbolo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Predeterminada
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currencies.length > 0 ? (
              currencies.map((currency) => (
                <tr key={currency.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{currency.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{currency.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{currency.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {currency.is_default ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sí
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(currency)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(currency.id)}
                        className={`text-red-600 hover:text-red-900 p-1 ${currency.is_default ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Eliminar"
                        disabled={currency.is_default}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron monedas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle (opcional) */}
      {selectedCurrency && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles de la Moneda</h3>
              <button
                onClick={() => setSelectedCurrency(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="mt-1">{selectedCurrency.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Código</p>
                <p className="mt-1">{selectedCurrency.code}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Símbolo</p>
                <p className="mt-1">{selectedCurrency.symbol}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Predeterminada</p>
                <p className="mt-1">{selectedCurrency.is_default ? 'Sí' : 'No'}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCurrency(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onEdit(selectedCurrency);
                  setSelectedCurrency(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyTable; 