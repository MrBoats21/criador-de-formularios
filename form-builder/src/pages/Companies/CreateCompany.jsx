import { useNavigate } from 'react-router-dom';
import { CompanyForm } from './CompanyForm';
import { Toast } from '../../components/Toast';
import { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

export default function CreateCompany() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const { createCompany } = useCompany();

  const handleSubmit = async (data) => {
    try {
      await createCompany(data);
      setToast({ 
        message: 'Empresa criada com sucesso!', 
        type: 'success' 
      });
      
      // Aguarda o toast ser exibido antes de navegar
      setTimeout(() => {
        navigate('/companies');
      }, 1000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ 
        message: 'Erro ao criar empresa. Tente novamente.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Nova Empresa</h1>
        </div>
        <CompanyForm onSubmit={handleSubmit} />
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}