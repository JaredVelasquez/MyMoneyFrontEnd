import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Category } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CategoryForm = ({ category, onSubmit, onCancel, isSubmitting = false }: CategoryFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#3b82f6'); // Color azul por defecto
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos si estamos editando
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setIcon(category.icon || '');
      setColor(category.color || '#3b82f6');
    }
  }, [category]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
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
      name,
      description: description.trim() || undefined,
      icon: icon.trim() || undefined,
      color
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
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
              placeholder="Ej: Alimentación"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Opcional: breve descripción de la categoría"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Icono */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icono (emoji)
            </label>
            <input
              type="text"
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: 🍔"
              maxLength={2}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Puedes usar un emoji como icono para la categoría
            </p>
          </div>
          
          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 rounded-md border-gray-300 shadow-sm cursor-pointer"
                disabled={isSubmitting}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="ml-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="#3b82f6"
                disabled={isSubmitting}
              />
            </div>
          </div>
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
            {isSubmitting ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm; 