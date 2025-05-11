import StatCard from '../ui/StatCard';
import type { ReactNode } from 'react';
import { 
  BanknotesIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

export interface StatCardData {
  id?: string;
  title: string;
  value: string;
  icon?: ReactNode;
  color?: string;
  change?: {
    value: string;
    isPositive: boolean;
    text: string;
  };
}

interface StatCardsProps {
  stats: StatCardData[];
  isLoading?: boolean;
}

const StatCards = ({ stats, isLoading = false }: StatCardsProps) => {
  // Datos por defecto
  const defaultStats: StatCardData[] = [
    {
      id: 'balance',
      title: 'Saldo Disponible',
      value: '$4,582.75',
      icon: <BanknotesIcon className="h-5 w-5 text-blue-600" />,
      change: {
        value: '12%',
        isPositive: true,
        text: 'desde el mes pasado'
      }
    },
    {
      id: 'income',
      title: 'Ingresos Totales',
      value: '$2,750.00',
      icon: <ArrowUpIcon className="h-5 w-5 text-green-600" />,
      change: {
        value: '5%',
        isPositive: true,
        text: 'este mes'
      }
    },
    {
      id: 'expenses',
      title: 'Gastos Totales',
      value: '$1,253.45',
      icon: <ArrowDownIcon className="h-5 w-5 text-red-600" />,
      change: {
        value: '8%',
        isPositive: false,
        text: 'este mes'
      }
    },
    {
      id: 'balance-month',
      title: 'Balance del Mes',
      value: '$1,496.55',
      icon: <ScaleIcon className="h-5 w-5 text-purple-600" />,
      change: {
        value: '2%',
        isPositive: true,
        text: 'desde el mes pasado'
      }
    }
  ];

  // Si está cargando, muestra un skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Usar los datos proporcionados o los predeterminados
  const cardsToRender = stats && stats.length > 0 ? stats : defaultStats;

  // Mapeo de colores para iconos si no vienen especificados
  const iconColors = {
    'Saldo Disponible': <BanknotesIcon className="h-5 w-5 text-blue-600" />,
    'Balance total': <BanknotesIcon className="h-5 w-5 text-blue-600" />,
    'Ingresos Totales': <ArrowUpIcon className="h-5 w-5 text-green-600" />,
    'Ingresos del mes': <ArrowUpIcon className="h-5 w-5 text-green-600" />,
    'Gastos Totales': <ArrowDownIcon className="h-5 w-5 text-red-600" />,
    'Gastos del mes': <ArrowDownIcon className="h-5 w-5 text-red-600" />,
    'Balance del Mes': <ScaleIcon className="h-5 w-5 text-purple-600" />
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardsToRender.map((stat, index) => (
        <StatCard
          key={stat.id || index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon || iconColors[stat.title as keyof typeof iconColors] || <BanknotesIcon className="h-5 w-5 text-gray-600" />}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default StatCards; 