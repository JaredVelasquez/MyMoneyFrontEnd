import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  text: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'red';
  onClick?: () => void;
  href?: string;
}

const ActionButton = ({ text, icon, color, onClick, href }: ActionButtonProps) => {
  // Determinar los colores basados en la prop color
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  const buttonClass = `${colorClasses[color]} text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200`;
  
  // Si hay un href, renderizamos un Link, de lo contrario un botón
  if (href) {
    return (
      <Link to={href} className={buttonClass}>
        <span className="mr-2">{icon}</span>
        <span>{text}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      <span className="mr-2">{icon}</span>
      <span>{text}</span>
    </button>
  );
};

export default ActionButton; 