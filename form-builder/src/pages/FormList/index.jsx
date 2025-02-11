/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { Toast } from '../../components/Toast';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { getForms, deleteForm } = useForm();

  useEffect(() => {
    loadForms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForms = async () => {
    try {
      const response = await getForms();
      setForms(Array.isArray(response) ? response : []); // Garante que `forms` seja um array
    } catch (error) {
      setToast({ message: 'Erro ao carregar formulários', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este formulário?')) return;
    
    try {
      await deleteForm(id);
      setToast({ message: 'Formulário excluído com sucesso', type: 'success' });
      loadForms();
    } catch (error) {
      setToast({ message: 'Erro ao excluir formulário', type: 'error' });
    }
  };

  if (isLoading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Formulários</h1>
        <Link 
          to="/admin/form-builder"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Novo Formulário
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum formulário criado ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
              <p className="text-gray-500 text-sm mb-4">
                Atualizado em: {new Date(form.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/admin/form-builder/${form.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="text-red-500 hover:text-red-700"
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