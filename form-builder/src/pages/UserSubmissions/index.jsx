import { useState, useEffect } from 'react';
import { useSubmission } from '../../contexts/SubmissionContext';
import { Toast } from '../../components/Toast';

export default function UserSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { getSubmissions } = useSubmission();

  useEffect(() => {
    loadSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await getSubmissions();
      setSubmissions(response || []); // Garante que será sempre um array
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao carregar respostas', type: 'error' });
      setSubmissions([]); // Em caso de erro, inicializa como array vazio
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Minhas Respostas</h1>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Você ainda não respondeu nenhum formulário.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">
                Formulário: {submission.formTitle}
              </h2>
              <p className="text-gray-500 text-sm">
                Enviado em: {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                {Object.entries(submission.answers).map(([key, value]) => (
                  <div key={key} className="py-2 border-t">
                    <span className="font-medium">{key}:</span>{' '}
                    <span>{typeof value === 'object' ? 'Arquivo/Imagem' : value.toString()}</span>
                  </div>
                ))}
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