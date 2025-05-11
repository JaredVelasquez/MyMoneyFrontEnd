import DashboardLayout from '../layouts/DashboardLayout';
import TransactionMethodSelector from '../components/transactions/TransactionMethodSelector';

const TransactionNew = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Transacción</h1>
        <TransactionMethodSelector />
      </div>
    </DashboardLayout>
  );
};

export default TransactionNew; 