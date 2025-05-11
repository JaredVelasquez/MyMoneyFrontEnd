import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <div className="h-16 w-16 text-blue-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}

        <div className="mt-10 text-center">
          {window.location.pathname === '/login' ? (
            <p className="text-sm text-gray-500">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Regístrate
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Inicia sesión
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 