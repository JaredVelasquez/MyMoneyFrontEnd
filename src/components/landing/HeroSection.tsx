import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Controla tus finanzas</span>
            <span className="block text-blue-700">de manera simple</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            La plataforma que te ayuda a organizar tus gastos, ahorrar dinero y alcanzar tus metas financieras con una interfaz intuitiva y herramientas potentes.
          </p>
          <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Comenzar Gratis
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
          <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md transition-transform duration-500 hover:scale-105">
            <div className="relative block w-full bg-white rounded-lg overflow-hidden">
              <img
                className="w-full"
                src="https://images.unsplash.com/photo-1579621970590-9d624316904b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Dashboard de finanzas personales"
              />
              <div className="absolute inset-0 bg-blue-700 bg-opacity-30 flex items-center justify-center">
                <svg className="h-20 w-20 text-white" fill="currentColor" viewBox="0 0 84 84">
                  <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                  <path d="M55 42L35 55V29L55 42Z" fill="#3B82F6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 