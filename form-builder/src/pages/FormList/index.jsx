import { useState } from 'react';
import { useForm } from '../../contexts/FormContext';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast';

export default function FormList() {
  const { forms, loading, error, setCurrentForm, deleteForm, refreshForms } = useForm();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (formId) => {
    setCurrentForm(formId);
    navigate('/form-builder');
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Tem certeza que deseja excluir este formulário?')) {
      return;
    }

    try {
      await deleteForm(formId);
      setToast({ message: 'Formulário excluído com sucesso', type: 'success' });
      refreshForms();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao excluir formulário', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Carregando formulários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Formulários</h1>
        <button
          onClick={() => {
            setCurrentForm(null);
            navigate('/form-builder');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Novo Formulário
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          Nenhum formulário criado ainda
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map(form => (
            <div 
              key={form.id} 
              className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold">{form.title || 'Sem título'}</h2>
                <p className="text-sm text-gray-500">
                  Atualizado em: {new Date(form.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => handleEdit(form.id)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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