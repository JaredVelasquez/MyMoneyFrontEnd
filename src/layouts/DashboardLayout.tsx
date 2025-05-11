import type { ReactNode } from 'react';
import Sidebar from '../components/layout/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 