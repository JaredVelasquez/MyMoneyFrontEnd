import DashboardLayout from '../layouts/DashboardLayout';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Support = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <QuestionMarkCircleIcon className="h-8 w-8 text-blue-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Ayuda y Soporte</h1>
        </div>
        
        <p className="text-gray-600 mb-8">Encuentra respuestas a tus preguntas y obtén asistencia para usar la plataforma.</p>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">¿Cómo puedo añadir una transacción?</h3>
            <p className="text-gray-600">Puedes añadir una transacción desde el botón "Añadir Transacción" en el dashboard o desde la sección de Transacciones.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">¿Cómo funciona la entrada por imagen?</h3>
            <p className="text-gray-600">La entrada por imagen te permite subir una foto de tu factura o recibo. El sistema extraerá automáticamente la información relevante.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">¿Puedo exportar mis datos?</h3>
            <p className="text-gray-600">Sí, puedes exportar tus transacciones a formato CSV desde la sección de Transacciones.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">¿Cómo cambio mi contraseña?</h3>
            <p className="text-gray-600">Puedes cambiar tu contraseña desde la sección de Mi Cuenta, en la pestaña de Seguridad.</p>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">¿No encuentras lo que buscas?</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support; 