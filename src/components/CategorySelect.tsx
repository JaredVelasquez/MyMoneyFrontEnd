import React, { useState, useEffect } from 'react';
import { CategoryService } from '../services/category.service';
import type { Category } from '../types';
import type { TransactionType } from '../types/transaction';

interface CategorySelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  transactionType: TransactionType;
  required?: boolean;
  label?: string;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  id,
  name,
  value,
  onChange,
  transactionType,
  required = false,
  label,
  className = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`CategorySelect - Iniciando carga de categorías para ${transactionType}`);
        const categoryService = new CategoryService();
        
        // Obtener categorías según el tipo de transacción
        const response = transactionType === 'INCOME'
          ? await categoryService.getIncomeCategories()
          : await categoryService.getExpenseCategories();
        
        // Verificar y depurar la respuesta
        console.log('CategorySelect - Respuesta del servicio:', JSON.stringify(response, null, 2));
        console.log('CategorySelect - Estado HTTP:', response.status);
        
        if (Array.isArray(response.data)) {
          console.log(`CategorySelect - Se encontraron ${response.data.length} categorías para ${transactionType}`);
          setCategories(response.data);
        } else {
          console.error('CategorySelect - La respuesta no es un array:', response.data);
          setCategories([]);
          setError('Error al cargar las categorías: formato de respuesta inválido');
        }
      } catch (err) {
        console.error(`CategorySelect - Error al cargar categorías para ${transactionType}:`, err);
        
        // Detallar el error para depuración
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as any;
          console.error('CategorySelect - Detalles del error:', {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          });
        }
        
        setError('Error al cargar las categorías. Por favor, inténtalo de nuevo más tarde.');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [transactionType]);

  // Crear datos de ejemplo si no hay categorías
  useEffect(() => {
    if (!isLoading && categories.length === 0 && !error) {
      console.log(`CategorySelect - Generando categorías de ejemplo para ${transactionType}`);
      
      // Datos de ejemplo para desarrollo según el tipo de transacción
      if (transactionType === 'INCOME') {
        const sampleIncomeCategories: Category[] = [
          {
            id: '1',
            name: 'Salario',
            description: 'Ingresos por trabajo',
            color: '#4CAF50',
            icon: 'work',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Inversiones',
            description: 'Ingresos por inversiones',
            color: '#2196F3',
            icon: 'trending_up',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Otros ingresos',
            description: 'Otros tipos de ingresos',
            color: '#9C27B0',
            icon: 'attach_money',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setCategories(sampleIncomeCategories);
      } else {
        const sampleExpenseCategories: Category[] = [
          {
            id: '4',
            name: 'Alimentación',
            description: 'Gastos en comida',
            color: '#F44336',
            icon: 'restaurant',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Transporte',
            description: 'Gastos en transporte',
            color: '#FF9800',
            icon: 'directions_car',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Entretenimiento',
            description: 'Gastos en entretenimiento',
            color: '#673AB7',
            icon: 'movie',
            user_id: 'current-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setCategories(sampleExpenseCategories);
      }
    }
  }, [isLoading, categories.length, error, transactionType]);

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
        <option value="">Seleccionar categoría</option>
        {isLoading ? (
          <option disabled>Cargando...</option>
        ) : error ? (
          <option disabled>Error al cargar las categorías</option>
        ) : (
          categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        )}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {!isLoading && categories.length === 0 && !error && (
        <p className="mt-1 text-sm text-amber-600">
          No se encontraron categorías para {transactionType === 'INCOME' ? 'ingresos' : 'gastos'}. 
          Por favor, crea una primero.
        </p>
      )}
    </div>
  );
};

export default CategorySelect; 