/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useSubmission } from '../../contexts/SubmissionContext';
import { Toast } from '../../components/Toast';
import { ChevronDown, ChevronUp, Trash } from 'lucide-react';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedSubmissions, setExpandedSubmissions] = useState({});
  const { getAllSubmissions, deleteSubmission } = useSubmission();

  useEffect(() => {
    loadSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSubmissions();
      setSubmissions(response || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar submissões', type: 'error' });
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation(); // Evita que o clique propague para o toggleSubmission
    
    if (window.confirm('Tem certeza que deseja excluir esta submissão?')) {
      try {
        await deleteSubmission(id);
        setSubmissions(submissions.filter(sub => sub.id !== id));
        setToast({ message: 'Submissão deletada com sucesso', type: 'success' });
      } catch (error) {
        setToast({ message: 'Erro ao deletar submissão', type: 'error' });
      }
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(submission.id, e)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-600"
                    aria-label="Deletar submissão"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
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