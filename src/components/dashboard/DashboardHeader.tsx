import SearchBar from '../ui/SearchBar';
import NotificationBell from '../ui/NotificationBell';

interface DashboardHeaderProps {
  title: string;
  hasNotifications?: boolean;
  onSearch?: (searchTerm: string) => void;
  onNotificationClick?: () => void;
}

const DashboardHeader = ({ 
  title, 
  hasNotifications = false, 
  onSearch, 
  onNotificationClick 
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-64">
          <SearchBar 
            placeholder="Buscar..."
            onSearch={onSearch}
          />
        </div>
        <NotificationBell 
          hasNotifications={hasNotifications}
          onClick={onNotificationClick}
        />
      </div>
    </div>
  );
};

export default DashboardHeader; 