import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services';
import { useNavigate } from 'react-router-dom';

// Iconos
import { 
  HomeIcon, 
  ArrowsRightLeftIcon, 
  ChartBarIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  ArrowRightStartOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };
  
  // Enlaces de navegación
  const navLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/transactions', name: 'Transacciones', icon: ArrowsRightLeftIcon },
    { path: '/reports', name: 'Reportes', icon: ChartBarIcon },
    { path: '/currencies', name: 'Monedas', icon: CurrencyDollarIcon },
    { path: '/account', name: 'Cuenta', icon: UserIcon },
  ];
  
  return (
    <div className="flex flex-col h-full bg-blue-700 text-white min-w-64 p-4">
      {/* Logo y nombre de la app */}
      <div className="flex items-center mb-8 pl-2">
        <div className="bg-orange-400 p-2 rounded-lg">
          <CurrencyDollarIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold ml-2">FinanzApp</h1>
      </div>
      
      {/* Plan gratuito */}
      <div className="bg-blue-800 rounded-lg mb-6 p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Periodo gratuito</span>
        </div>
        <div className="w-full bg-blue-900 h-2 rounded-full mt-2">
          <div className="bg-green-400 h-2 rounded-full" style={{ width: '20%' }}></div>
        </div>
        <div className="text-xs text-right mt-1">15 días restantes</div>
      </div>
      
      {/* Navegación principal */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center p-2 rounded-lg hover:bg-blue-600 ${
                  currentPath === link.path ? 'bg-blue-600' : ''
                }`}
              >
                <link.icon className="h-5 w-5 mr-3" />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Enlaces inferiores */}
      <div className="mt-auto space-y-2">
        <Link
          to="/premium"
          className="flex items-center p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
        >
          <SparklesIcon className="h-5 w-5 mr-3" />
          <span>Actualizar a Premium</span>
        </Link>
        
        <Link
          to="/support"
          className="flex items-center p-2 rounded-lg hover:bg-blue-600"
        >
          <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
          <span>Ayuda y Soporte</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded-lg hover:bg-blue-600 text-left"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
      
      {/* Usuario */}
      <div className="flex items-center mt-4 pt-4 border-t border-blue-600">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-medium">
          CG
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">Carlos Gómez</div>
        </div>
        <button className="ml-auto">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 