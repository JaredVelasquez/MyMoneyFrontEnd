interface StatData {
  amount: number;
  percentage: number;
}

interface StatsSummaryProps {
  incomeStat: StatData;
  expenseStat: StatData;
  isLoading?: boolean;
}

const StatsSummary = ({ incomeStat, expenseStat, isLoading = false }: StatsSummaryProps) => {
  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-6">Ingresos vs Gastos</h2>
        <div className="space-y-6 animate-pulse">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const defaultIncome: StatData = { amount: 2750, percentage: 100 };
  const defaultExpense: StatData = { amount: 1253.45, percentage: 45.58 };

  // Usar los datos proporcionados o los predeterminados
  const income = incomeStat?.amount ? incomeStat : defaultIncome;
  const expense = expenseStat?.amount ? expenseStat : defaultExpense;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium mb-6">Ingresos vs Gastos</h2>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Ingresos</span>
            <span className="text-sm text-gray-600">${income.amount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
          <div className="text-xs text-gray-500">100% de referencia</div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Gastos</span>
            <span className="text-sm text-gray-600">${expense.amount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${expense.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">{expense.percentage.toFixed(1)}% de los ingresos</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary; 