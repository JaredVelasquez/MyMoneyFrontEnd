import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import { CategoryService } from '../services/category.service';
import type { UpdateCategoryRequest } from '../types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Servicios
const categoryService = new CategoryService();

const CategoryEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Formulario
  const [formData, setFormData] = useState<UpdateCategoryRequest>({
    name: '',
    description: '',
    color: '',
    icon: '',
  });

  // Cargar datos de la categoría
  useEffect(() => {
    if (!id) return;
    
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await categoryService.getCategoryById(id);
        const category = response.data;
        
        setFormData({
          name: category.name,
          description: category.description || '',
          color: category.color || '#3B82F6',
          icon: category.icon || 'tag',
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar la categoría:', error);
        setErrorMessage('Error al cargar los datos de la categoría');
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleColorChange = (color: string) => {
    setFormData({
      ...formData,
      color
    });
  };

  const handleIconChange = (icon: string) => {
    setFormData({
      ...formData,
      icon
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Validar campos requeridos
      if (!formData.name) {
        setErrorMessage('El nombre es requerido');
        setIsSubmitting(false);
        return;
      }
      
      // Actualizar categoría
      await categoryService.updateCategory(id, formData);
      navigate('/categories');
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      setErrorMessage('Error al actualizar la categoría. Por favor verifique los datos e intente nuevamente.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600">Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/categories" className="mr-4 text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Editar Categoría</h1>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <FormInput
              id="name"
              name="name"
              label="Nombre"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mb-4">
            <FormTextarea
              id="description"
              name="description"
              label="Descripción"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color || '#3B82F6'}
                onChange={handleInputChange}
                className="h-10 w-full rounded-md border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
              <FormInput
                id="icon"
                name="icon"
                label="Icono"
                value={formData.icon || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium 
                ${isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Categoría'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CategoryEditForm; 