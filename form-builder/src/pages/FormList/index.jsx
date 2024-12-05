import { useForm } from '../../contexts/FormContext';
import { useNavigate } from 'react-router-dom';

export default function FormList() {
  const { forms, setCurrentForm, deleteForm } = useForm();
  const navigate = useNavigate();

  const handleEdit = (formId) => {
    setCurrentForm(formId);
    navigate('/admin/form-builder');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Formulários</h1>
        <button
          onClick={() => {
            setCurrentForm(null);
            navigate('/admin/form-builder');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Novo Formulário
        </button>
      </div>

      <div className="grid gap-4">
        {forms.map(form => (
          <div key={form.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{form.title || 'Sem título'}</h2>
              <p className="text-sm text-gray-500">
                Atualizado em: {new Date(form.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(form.id)}
                className="text-blue-500"
              >
                Editar
              </button>
              <button
                onClick={() => deleteForm(form.id)}
                className="text-red-500"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}