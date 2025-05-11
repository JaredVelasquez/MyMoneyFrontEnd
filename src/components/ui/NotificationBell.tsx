import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationBellProps {
  hasNotifications?: boolean;
  onClick?: () => void;
}

const NotificationBell = ({ 
  hasNotifications = false, 
  onClick 
}: NotificationBellProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    if (onClick) onClick();
  };

  return (
    <button 
      onClick={handleClick} 
      className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative ${isAnimating ? 'animate-wiggle' : ''}`}
      style={{ transformOrigin: 'top center' }}
    >
      <BellIcon className="h-5 w-5 text-gray-600" />
      {hasNotifications && (
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
};

export default NotificationBell;

// Añade esto a tu archivo global.css o tailwind.config.js para la animación
// @keyframes wiggle {
//   0%, 100% { transform: rotate(0); }
//   25% { transform: rotate(10deg); }
//   50% { transform: rotate(-10deg); }
//   75% { transform: rotate(5deg); }
// }
// .animate-wiggle {
//   animation: wiggle 0.3s ease-in-out;
// } 