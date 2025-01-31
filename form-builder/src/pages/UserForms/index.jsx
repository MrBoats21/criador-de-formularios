import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { Toast } from '../../components/Toast';

export default function UserForms() {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { getForms } = useForm();

  useEffect(() => {
    loadForms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const response = await getForms();
      setForms(response || []); // Garante que será sempre um array
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao carregar formulários', type: 'error' });
      setForms([]); // Em caso de erro, inicializa como array vazio
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Formulários Disponíveis</h1>
      
      {forms.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhum formulário disponível no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
            <div key={form.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
              <Link
                to={`/user/form/${form.id}/fill`}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Preencher
              </Link>
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