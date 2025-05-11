import DashboardLayout from '../layouts/DashboardLayout';

const Account = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>
        <p className="text-gray-600">Gestiona tu perfil, configuración y preferencias de usuario.</p>
      </div>
    </DashboardLayout>
  );
};

export default Account; 