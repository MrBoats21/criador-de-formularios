import { useNavigate, useParams } from 'react-router-dom';
import { CompanyForm } from './CompanyForm';
import { Toast } from '../../components/Toast';
import { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

export default function EditCompany() {
  const { id } = useParams();
  console.log('EditCompany - ID:', id); // Log do ID
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const { getCompany, updateCompany } = useCompany();
  const company = getCompany(Number(id));
  console.log('EditCompany - Company:', company);

  const handleSubmit = async (data) => {
    try {
      await updateCompany(Number(id), data);
      setToast({ 
        message: 'Empresa atualizada com sucesso!', 
        type: 'success' 
      });
      setTimeout(() => {
        navigate('/companies');
      }, 1000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ 
        message: 'Erro ao atualizar empresa. Tente novamente.', 
        type: 'error' 
      });
    }
  };

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500">Empresa não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Empresa</h1>
        </div>
        <CompanyForm 
          initialData={{
            name: company.name,
            backgroundColor: company.backgroundColor,
            primaryColor: company.primaryColor,
            secondaryColor: company.secondaryColor,
            logoUrl: company.logoUrl
          }} 
          onSubmit={handleSubmit} 
        />
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