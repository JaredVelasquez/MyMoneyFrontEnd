import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import type { Category } from '../../types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

const CategoryTable = ({ categories, onEdit, onDelete, onCreate, isLoading = false }: CategoryTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
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
        <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Categoría</span>
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.icon && (
                        <span className="mr-2 text-lg">{category.icon}</span>
                      )}
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.color ? (
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-gray-500">{category.color}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
                  No se encontraron categorías
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle (opcional) */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detalles de la Categoría</h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="mt-1">{selectedCategory.name}</p>
              </div>
              
              {selectedCategory.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Descripción</p>
                  <p className="mt-1">{selectedCategory.description}</p>
                </div>
              )}
              
              {selectedCategory.color && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Color</p>
                  <div className="mt-1 flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: selectedCategory.color }}
                    ></div>
                    <span>{selectedCategory.color}</span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Creado</p>
                <p className="mt-1">{new Date(selectedCategory.created_at || '').toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onEdit(selectedCategory);
                  setSelectedCategory(null);
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

export default CategoryTable; 