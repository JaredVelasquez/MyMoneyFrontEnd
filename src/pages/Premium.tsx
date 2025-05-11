import DashboardLayout from '../layouts/DashboardLayout';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

const Premium = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <SparklesIcon className="h-8 w-8 text-amber-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Actualizar a Premium</h1>
        </div>
        
        <p className="text-gray-600 mb-8">Desbloquea todas las funcionalidades y mejora tu experiencia financiera.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Gratuito</h2>
            <div className="text-3xl font-bold mb-6">$0<span className="text-gray-500 text-lg font-normal">/mes</span></div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Registro manual de transacciones</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Dashboard básico</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Exportación a CSV</span>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="h-5 w-5 flex items-center justify-center mr-2">✕</span>
                <span>Entrada por imagen</span>
              </li>
              <li className="flex items-center text-gray-400">
                <span className="h-5 w-5 flex items-center justify-center mr-2">✕</span>
                <span>Entrada por voz</span>
              </li>
            </ul>
            
            <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
              Plan Actual
            </button>
          </div>
          
          <div className="border-2 border-amber-500 rounded-xl p-6 relative">
            <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMENDADO
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Premium</h2>
            <div className="text-3xl font-bold mb-6">$9.99<span className="text-gray-500 text-lg font-normal">/mes</span></div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Todo lo del plan gratuito</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Entrada por imagen (OCR)</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Entrada por voz</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Prompts en lenguaje natural</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Reportes avanzados</span>
              </li>
            </ul>
            
            <button className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-medium">
              Actualizar Ahora
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Premium; 