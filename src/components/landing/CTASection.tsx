import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-2xl p-10 md:p-16 transform transition-all duration-500 hover:shadow-lg">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Empieza a controlar tus finanzas hoy
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Regístrate gratis y comienza a transformar tu relación con el dinero
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
              >
                Crear cuenta gratuita
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              No necesitas tarjeta de crédito para comenzar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 