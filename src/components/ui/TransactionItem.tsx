import type { ReactNode } from 'react';

interface TransactionItemProps {
  icon: ReactNode | string;
  description: string;
  category: string;
  date: string;
  amount: string;
  isIncome: boolean;
}

const TransactionItem = ({ 
  icon, 
  description, 
  category, 
  date, 
  amount, 
  isIncome 
}: TransactionItemProps) => {
  return (
    <div className="grid grid-cols-5 items-center py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div className="col-span-2 flex items-center">
        <div className="bg-blue-100 p-2 rounded-lg mr-3 flex items-center justify-center">
          {typeof icon === 'string' ? (
            <span className="text-blue-600 text-lg">{icon}</span>
          ) : (
            <span className="text-blue-600">{icon}</span>
          )}
        </div>
        <div>
          <div className="font-medium">{description}</div>
        </div>
      </div>
      <div className="text-sm">{category}</div>
      <div className="text-sm">{date}</div>
      <div className={`text-right ${isIncome ? 'text-green-600' : 'text-red-600'} font-medium`}>
        {isIncome ? '+' : '-'}{amount}
      </div>
    </div>
  );
};

export default TransactionItem; 