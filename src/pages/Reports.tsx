import DashboardLayout from '../layouts/DashboardLayout';

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h1>
        <p className="text-gray-600">Visualiza y analiza tus finanzas personales con gráficos y reportes detallados.</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports; 