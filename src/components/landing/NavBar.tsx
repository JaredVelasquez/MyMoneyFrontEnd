import { Link } from 'react-router-dom';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="bg-blue-700 p-2 rounded-lg transition-transform duration-300 hover:scale-110">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">FinanzApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium transition-colors duration-200"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 