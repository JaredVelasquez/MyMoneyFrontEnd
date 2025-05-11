import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import CategoryTable from '../components/settings/CategoryTable';
import CategoryForm from '../components/settings/CategoryForm';
import { CategoryService } from '../services/category.service';
import type { Category } from '../types';

const Categories = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();
  const categoryService = new CategoryService();

  // Consultar categorías
  const { data: categories, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAll();
      return response.data;
    }
  });

  // Crear categoría
  const createCategoryMutation = useMutation({
    mutationFn: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => 
      categoryService.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
    }
  });

  // Actualizar categoría
  const updateCategoryMutation = useMutation({
    mutationFn: (params: { id: string; category: Partial<Category> }) => 
      categoryService.update(params.id, params.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
      setSelectedCategory(null);
    }
  });

  // Eliminar categoría
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleFormSubmit = (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({
        id: selectedCategory.id,
        category: categoryData
      });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Categorías</h1>
          <p className="text-gray-600 mt-1">
            Administra las categorías para clasificar tus transacciones
          </p>
        </div>

        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>Error al cargar las categorías: {(error as Error).message}</p>
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
              <CategoryForm 
                category={selectedCategory || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isSubmitting={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              />
            </div>
          </div>
        ) : null}

        <CategoryTable 
          categories={categories || []}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onCreate={handleCreateCategory}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Categories; 