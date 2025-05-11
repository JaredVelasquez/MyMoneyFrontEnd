export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseDistributionProps {
  categories: ExpenseCategory[];
  isLoading?: boolean;
}

const ExpenseDistribution = ({ categories, isLoading = false }: ExpenseDistributionProps) => {
  const defaultCategories: ExpenseCategory[] = [
    { id: '1', name: 'Comida', amount: 420, percentage: 35, color: 'bg-blue-500' },
    { id: '2', name: 'Transporte', amount: 240, percentage: 20, color: 'bg-green-500' },
    { id: '3', name: 'Entretenimiento', amount: 180, percentage: 15, color: 'bg-purple-500' },
    { id: '4', name: 'Compras', amount: 150, percentage: 12.5, color: 'bg-yellow-500' },
    { id: '5', name: 'Otros', amount: 210, percentage: 17.5, color: 'bg-red-500' }
  ];

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-6">Distribución de Gastos</h2>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Si no hay categorías o están vacías
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-6">Distribución de Gastos</h2>
        <div className="py-8 text-center text-gray-500">
          <p>No hay datos de gastos para mostrar</p>
        </div>
      </div>
    );
  }

  // Usar los datos proporcionados o los predeterminados
  const categoriesToShow = categories.length > 0 ? categories : defaultCategories;
  
  // Colores por defecto si no se proporcionan
  const defaultColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 
                        'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium mb-6">Distribución de Gastos</h2>
      <div className="space-y-5">
        {categoriesToShow.map((category, index) => (
          <div key={category.id || index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-sm text-gray-600">${category.amount.toFixed(2)} · {category.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${category.color || defaultColors[index % defaultColors.length]}`} 
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDistribution; 