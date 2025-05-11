import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: {
    value: string;
    isPositive: boolean;
    text: string;
  };
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="bg-blue-100 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      {change && (
        <div className="flex items-center text-sm">
          <svg 
            className={`h-4 w-4 ${change.isPositive ? 'text-green-500' : 'text-red-500'} mr-1`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={change.isPositive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
            />
          </svg>
          <span className={`${change.isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
            {change.value}
          </span>
          <span className="text-gray-500 ml-1">{change.text}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard; 