import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import FormInput from '../components/ui/FormInput';
import FormSelect from '../components/ui/FormSelect';
import FormTextarea from '../components/ui/FormTextarea';
import { TransactionService } from '../services/transaction.service';
import { CategoryService } from '../services/category.service';
import { PaymentMethodService } from '../services/payment-method.service';
import { CurrencyService } from '../services/currency.service';
import type { PaymentMethod, Category, Currency, CreateTransactionRequest, TransactionType } from '../types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';

// Servicios
const transactionService = new TransactionService();
const categoryService = new CategoryService();
const paymentMethodService = new PaymentMethodService();
const currencyService = new CurrencyService();

const TransactionForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  
  // Datos para selects
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  
  // Estado para controlar si ya se han cargado las categorías de cada tipo
  const [loadedCategoryTypes, setLoadedCategoryTypes] = useState<{
    INCOME: boolean;
    EXPENSE: boolean;
  }>({
    INCOME: false,
    EXPENSE: false
  });
  
  // Formulario
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    amount: 0,
    description: '',
    category_id: '',
    type: 'EXPENSE',
    payment_method_id: '',
    currency_id: '',
    date: dayjs().format('YYYY-MM-DD'),
  });

  // Cargar métodos de pago y monedas solo una vez
  useEffect(() => {
    let isMounted = true;
    
    const fetchBaseData = async () => {
      setIsLoading(true);
      setLoadingMessage("Cargando datos básicos...");
      
      try {
        // Cargar monedas desde el backend
        setLoadingMessage("Cargando monedas...");
        const currenciesResponse = await currencyService.getAll();
        if (isMounted) setCurrencies(currenciesResponse.data);
        
        // Cargar métodos de pago desde el backend
        setLoadingMessage("Cargando métodos de pago...");
        const paymentMethodsResponse = await paymentMethodService.getAll();
        // Depuración de la respuesta de métodos de pago
        console.log('Respuesta de métodos de pago:', JSON.stringify(paymentMethodsResponse, null, 2));
        if (isMounted) setPaymentMethods(paymentMethodsResponse.data);
        
        setLoadingMessage(null);
      } catch (error) {
        console.error('Error al cargar datos básicos:', error);
        if (isMounted) {
          setErrorMessage('Error al cargar los datos necesarios. Por favor intente nuevamente.');
          setPaymentMethods([]);
          setCurrencies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setLoadingMessage(null);
        }
      }
    };
    
    fetchBaseData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Función para cargar categorías según el tipo
  const loadCategories = async (type: TransactionType) => {
    // Evitar consultas duplicadas para el mismo tipo
    if (loadedCategoryTypes[type]) {
      return;
    }
    
    setLoadingMessage(`Cargando categorías de ${type === 'INCOME' ? 'ingresos' : 'gastos'}...`);
    
    try {
      // Obtenemos las categorías según el tipo usando los métodos correctos
      let categoriesResponse;
      if (type === 'INCOME') {
        categoriesResponse = await categoryService.getIncomeCategories();
      } else {
        categoriesResponse = await categoryService.getExpenseCategories();
      }
      
      setCategories(categoriesResponse.data);
      
      // Marcar este tipo como cargado
      setLoadedCategoryTypes(prev => ({
        ...prev,
        [type]: true
      }));
    } catch (error) {
      console.error(`Error al cargar categorías de tipo ${type}:`, error);
      setErrorMessage(`Error al cargar categorías de ${type === 'INCOME' ? 'ingresos' : 'gastos'}.`);
    } finally {
      setLoadingMessage(null);
    }
  };
  
  // Cargar categorías del tipo inicial
  useEffect(() => {
    if (formData.type === 'INCOME') {
      if (!loadedCategoryTypes.INCOME) {
        loadCategories('INCOME');
      }
    } else {
      if (!loadedCategoryTypes.EXPENSE) {
        loadCategories('EXPENSE');
      }
    }
  }, [formData.type, loadCategories, loadedCategoryTypes]);
  
  // Filtrar categorías ya no es necesario, ahora las cargamos del endpoint correcto
  // Simplemente usamos las categorías cargadas
  const filteredCategories = categories;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambiamos el tipo, reiniciar la categoría y cargar categorías si es necesario
    if (name === 'type') {
      const newType = value as TransactionType;
      setFormData({
        ...formData,
        type: newType,
        category_id: ''
      });
      
      // Cargar categorías del nuevo tipo si no se han cargado aún
      if (!loadedCategoryTypes[newType]) {
        loadCategories(newType);
      }
    } else if (name === 'amount') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'date') {
      // Usamos el formato de fecha correcto para el backend
      setFormData({
        ...formData,
        date: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Validar campos requeridos
      if (!formData.amount) {
        setErrorMessage('El monto es requerido');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.category_id) {
        setErrorMessage('La categoría es requerida');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.currency_id) {
        setErrorMessage('La moneda es requerida');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.date) {
        setErrorMessage('La fecha es requerida');
        setIsSubmitting(false);
        return;
      }
      
      // Formatear la fecha en formato ISO 8601 compatible con Go time.Time
      const dataToSubmit = {
        ...formData,
        date: `${formData.date}T00:00:00Z`
      };
      
      // Log de depuración
      console.log('Datos a enviar:', JSON.stringify(dataToSubmit, null, 2));
      
      await transactionService.create(dataToSubmit as any);
      navigate('/transactions');
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      
      // Depuración del error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.log('Respuesta de error:', axiosError.response);
        console.log('Datos de error:', axiosError.response?.data);
        
        // Intentar extraer mensaje de error más específico
        const errorMessage = axiosError.response?.data?.error ||
                              axiosError.response?.data?.message ||
                              'Error al crear la transacción';
        
        setErrorMessage(`Error: ${errorMessage}`);
      } else {
        setErrorMessage('Error al crear la transacción. Por favor verifique los datos e intente nuevamente.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link to="/transactions" className="mr-4 text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Nueva Transacción</h1>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        
        {isLoading && loadingMessage ? (
          <div className="bg-white shadow-md rounded-lg p-6 flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">{loadingMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`py-2 px-4 rounded-md text-center ${formData.type === 'INCOME' 
                        ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                      onClick={() => handleInputChange({ target: { name: 'type', value: 'INCOME' } } as React.ChangeEvent<HTMLInputElement>)}
                    >
                      Ingreso
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 rounded-md text-center ${formData.type === 'EXPENSE' 
                        ? 'bg-red-100 text-red-800 border-2 border-red-500' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'}`}
                      onClick={() => handleInputChange({ target: { name: 'type', value: 'EXPENSE' } } as React.ChangeEvent<HTMLInputElement>)}
                    >
                      Gasto
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="amount"
                name="amount"
                label="Monto"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount || ''}
                onChange={handleInputChange}
              />
              
              <FormSelect
                id="currency_id"
                name="currency_id"
                label="Moneda"
                required
                value={formData.currency_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar moneda</option>
                {currencies.map(currency => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </FormSelect>
            </div>
            
            <div className="mt-4 gap-4">
              <FormSelect
                id="category_id"
                name="category_id"
                label="Categoría"
                required
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar categoría</option>
                {loadingMessage && loadingMessage.includes('categorías') ? (
                  <option value="" disabled>Cargando categorías...</option>
                ) : (
                  filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </FormSelect>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormSelect
                id="payment_method_id"
                name="payment_method_id"
                label="Método de pago"
                value={formData.payment_method_id || ''}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar método de pago</option>
                {loadingMessage && loadingMessage.includes('métodos de pago') ? (
                  <option value="" disabled>Cargando métodos de pago...</option>
                ) : (
                  paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))
                )}
              </FormSelect>
              
              <FormInput
                id="date"
                name="date"
                label="Fecha"
                type="date"
                required
                value={formData.date.substring(0, 10)}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mt-4">
              <FormTextarea
                id="description"
                name="description"
                label="Descripción"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !!loadingMessage}
                className={`w-full py-2 px-4 rounded-md text-white font-medium 
                  ${(isSubmitting || isLoading || !!loadingMessage)
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : formData.type === 'INCOME' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Guardando...' : loadingMessage ? 'Cargando...' : 'Guardar Transacción'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionForm; 