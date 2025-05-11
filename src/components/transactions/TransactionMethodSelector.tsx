import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { 
  DocumentTextIcon, 
  CommandLineIcon, 
  MicrophoneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface MethodOption {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  enabled: boolean;
}

const TransactionMethodSelector = () => {
  const methods: MethodOption[] = [
    {
      id: 'form',
      title: 'Formulario',
      description: 'Ingresa la transacción usando un formulario tradicional con todos los campos necesarios.',
      icon: <DocumentTextIcon className="h-12 w-12 text-blue-500" />,
      path: '/transactions/new/form',
      enabled: true
    },
    {
      id: 'ai',
      title: 'Asistente IA',
      description: 'Usa inteligencia artificial para interpretar un mensaje de texto o imagen de un ticket.',
      icon: <SparklesIcon className="h-12 w-12 text-indigo-500" />,
      path: '/transactions/new/ai',
      enabled: true
    },
    {
      id: 'prompt',
      title: 'Prompt',
      description: 'Escribe en lenguaje natural "Pagué $45 por cena ayer" y lo convertimos en una transacción.',
      icon: <CommandLineIcon className="h-12 w-12 text-purple-500" />,
      path: '/transactions/new/prompt',
      enabled: false
    },
    {
      id: 'voice',
      title: 'Modo Voz',
      description: 'Simplemente habla y convertiremos tu voz en una transacción automáticamente.',
      icon: <MicrophoneIcon className="h-12 w-12 text-red-500" />,
      path: '/transactions/new/voice',
      enabled: true
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">¿Cómo quieres registrar tu transacción?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {methods.map((method) => (
          <div 
            key={method.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
              method.enabled 
                ? 'hover:shadow-md hover:-translate-y-1' 
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            {method.enabled ? (
              <Link to={method.path} className="block p-6 h-full">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-3 bg-gray-100 rounded-full mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{method.description}</p>
                  {!method.enabled && (
                    <span className="mt-4 inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                      Próximamente
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <div className="p-6 h-full">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-3 bg-gray-100 rounded-full mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{method.description}</p>
                  <span className="mt-4 inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                    Próximamente
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionMethodSelector; 