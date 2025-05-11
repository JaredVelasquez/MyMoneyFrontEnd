import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AITransactionForm from '../components/transaction/AITransactionForm';
import type { Transaction } from '../types';

const AITransaction: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const handleSuccess = (createdTransaction: Transaction) => {
    setSuccess(true);
    setTransaction(createdTransaction);
    
    // Redirigir después de un breve delay para mostrar el mensaje de éxito
    setTimeout(() => {
      navigate('/transactions');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Transacción con IA</h1>
        <p className="text-gray-600">
          Describe tu transacción en lenguaje natural o sube una imagen de un recibo o factura.
        </p>
      </div>

      {success && transaction ? (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">¡Transacción creada con éxito!</p>
          <p>
            {transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto'} de {transaction.amount} registrado correctamente.
            <br />
            Redirigiendo...
          </p>
        </div>
      ) : (
        <AITransactionForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AITransaction; 