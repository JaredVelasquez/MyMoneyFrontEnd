import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  textColor?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  bgColor = 'bg-blue-50', 
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-700',
  textColor = 'text-gray-600'
}: FeatureCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 transition-transform duration-300 hover:scale-105`}>
      <div className={`${iconBgColor} inline-flex p-3 rounded-lg`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className={`mt-2 text-base ${textColor}`}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard; 