/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { Toast } from '../../components/Toast';

export default function FormList() {
  const { forms, getForms, deleteForm } = useForm();
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForms = async () => {
    try {
      await getForms();
    } catch (error) {
      setToast({ message: 'Erro ao carregar formulários', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
      try {
        await deleteForm(id);
        loadForms(); // Recarrega a lista após deletar
        setToast({ message: 'Formulário excluído com sucesso', type: 'success' });
      } catch (error) {
        setToast({ message: 'Erro ao excluir formulário', type: 'error' });
      }
    }
  };

  const handleEdit = (formId) => {
    navigate(`/form-builder/${formId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Formulários</h1>
        <Link 
          to="/form-builder"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Novo Formulário
        </Link>
      </div>

      <div className="grid gap-4">
        {forms.map(form => (
          <div 
            key={form.id} 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{form.title || 'Sem título'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Criado em: {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(form.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            Nenhum formulário encontrado
          </div>
        )}
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