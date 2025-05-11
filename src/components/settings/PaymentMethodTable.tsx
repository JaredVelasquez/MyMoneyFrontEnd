import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import type { PaymentMethod } from '../../types';

interface PaymentMethodTableProps {
  paymentMethods: PaymentMethod[];
  onEdit: (paymentMethod: PaymentMethod) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

const PaymentMethodTable = ({ paymentMethods, onEdit, onDelete, onCreate, isLoading = false }: PaymentMethodTableProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
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
        <h2 className="text-xl font-bold text-gray-900">Métodos de Pago</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Método de Pago</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icono
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((paymentMethod) => (
                <tr key={paymentMethod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{paymentMethod.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{paymentMethod.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {paymentMethod.icon ? (
                      <span className="text-xl">{paymentMethod.icon}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(paymentMethod)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(paymentMethod.id)}
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
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron métodos de pago
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle (opcional) */}
      {selectedPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles del Método de Pago</h3>
              <button
                onClick={() => setSelectedPaymentMethod(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="mt-1">{selectedPaymentMethod.name}</p>
              </div>
              
              {selectedPaymentMethod.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Descripción</p>
                  <p className="mt-1">{selectedPaymentMethod.description}</p>
                </div>
              )}
              
              {selectedPaymentMethod.icon && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Icono</p>
                  <p className="mt-1 text-xl">{selectedPaymentMethod.icon}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Creado</p>
                <p className="mt-1">{new Date(selectedPaymentMethod.created_at || '').toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedPaymentMethod(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onEdit(selectedPaymentMethod);
                  setSelectedPaymentMethod(null);
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

export default PaymentMethodTable; 