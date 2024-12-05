import { useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { useAuth } from '../../contexts/AuthContext';

export default function UserForms() {
  const { forms } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Temporariamente mostraremos todos os formulários
  // Depois filtraremos baseado na empresa do usuário
  const availableForms = forms;

  const handleStartForm = (formId) => {
    navigate(`/forms/${formId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Formulários Disponíveis</h1>

      <div className="space-y-4">
        {availableForms.map(form => (
          <div 
            key={form.id} 
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{form.title}</h2>
                {form.company && (
                  <p className="text-sm text-gray-500 mt-1">
                    {form.company.name}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleStartForm(form.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Preencher
              </button>
            </div>

            {/* Status do formulário */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="text-gray-500">
                Criado em: {new Date(form.updatedAt).toLocaleDateString()}
              </span>
              {form.submissions?.find(s => s.userId === user.id) && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Respondido
                </span>
              )}
            </div>
          </div>
        ))}

        {availableForms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum formulário disponível no momento.
          </div>
        )}
      </div>
    </div>
  );
}