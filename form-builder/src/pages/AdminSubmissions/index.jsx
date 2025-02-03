import { useState, useEffect } from 'react';
import { useSubmission } from '../../contexts/SubmissionContext';
import { Toast } from '../../components/Toast';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedSubmissions, setExpandedSubmissions] = useState({});
  const { getAllSubmissions } = useSubmission();

  useEffect(() => {
    loadSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSubmissions();
      setSubmissions(response || []);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao carregar submissões', type: 'error' });
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubmission = (submissionId) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }));
  };

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Todas as Submissões</h1>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Nenhuma submissão encontrada.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-lg shadow">
              <div 
                className="p-6 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSubmission(submission.id)}
              >
                <div>
                  <h2 className="text-xl font-semibold">
                    Formulário: {submission.formTitle}
                  </h2>
                  <p className="text-gray-500">
                    Respondido por: {submission.userName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Enviado em: {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={expandedSubmissions[submission.id] ? "Recolher" : "Expandir"}
                >
                  {expandedSubmissions[submission.id] ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>

              {expandedSubmissions[submission.id] && (
                <div className="px-6 pb-6 border-t pt-4">
                  <div className="space-y-3">
                    {Object.entries(submission.answers).map(([key, answer]) => (
                      <div key={key} className="py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium">{answer.label}:</span>{' '}
                        <span className="text-gray-700">
                          {typeof answer.value === 'object' 
                            ? 'Arquivo/Imagem' 
                            : answer.value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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