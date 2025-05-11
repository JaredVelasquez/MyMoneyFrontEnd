import ActionButton from '../ui/ActionButton';
import { 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface ActionButtonsProps {
  onAddTransaction?: () => void;
  onAddIncome?: () => void;
  onAddExpense?: () => void;
}

const ActionButtons = ({ 
  onAddTransaction, 
  onAddIncome, 
  onAddExpense 
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      <ActionButton 
        text="Añadir Transacción" 
        icon={<PlusIcon className="h-5 w-5" />} 
        color="blue"
        onClick={onAddTransaction}
      />
      <ActionButton 
        text="Ingreso Rápido" 
        icon={<ArrowUpIcon className="h-5 w-5" />} 
        color="green"
        onClick={onAddIncome}
      />
      <ActionButton 
        text="Gasto Rápido" 
        icon={<ArrowDownIcon className="h-5 w-5" />} 
        color="red"
        onClick={onAddExpense}
      />
    </div>
  );
};

export default ActionButtons; 