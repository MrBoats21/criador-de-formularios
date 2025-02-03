import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { useSubmission } from '../../contexts/SubmissionContext';
import { FormRenderer } from '../../components/FormRenderer';
import { Toast } from '../../components/Toast';

export default function FormFill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getForm } = useForm();
  const { submitForm } = useSubmission();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    loadForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (form) {
      validateForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, form]);

  const validateForm = () => {
    if (!form?.fields) return false;
    
    for (const field of form.fields) {
      if (field.validations?.required) {
        const answer = answers[field.id];
        if (!answer?.value) {
          setIsValid(false);
          return;
        }
      }
    }
    setIsValid(true);
  };

  const loadForm = async () => {
    try {
      setIsLoading(true);
      const formData = await getForm(id);
      setForm(formData);
    } catch (error) {
      if (error.response?.data?.alreadySubmitted) {
        setToast({ 
          message: 'Você já respondeu este formulário', 
          type: 'warning' 
        });
        setTimeout(() => {
          navigate('/user/my-forms');
        }, 2000);
      } else {
        setToast({ 
          message: 'Erro ao carregar formulário', 
          type: 'error' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateAnswers = () => {
    const errors = [];
    form.fields.forEach(field => {
      if (field.validations?.required && !answers[field.id]?.value) {
        errors.push(`O campo "${field.label}" é obrigatório`);
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateAnswers();
    if (errors.length > 0) {
      setToast({ message: errors[0], type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      await submitForm(id, answers);
      setToast({ message: 'Formulário enviado com sucesso!', type: 'success' });
      setTimeout(() => {
        navigate('/user/my-forms');
      }, 2000);
    } catch (error) {
      setToast({ message: error.message || 'Erro ao enviar formulário', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Formulário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header do formulário */}
        <div 
          className="p-6 border-b"
          style={{ backgroundColor: form.theme?.backgroundColor }}
        >
          {form.theme?.logoUrl && (
            <img 
              src={form.theme.logoUrl} 
              alt="Logo" 
              className="h-12 object-contain"
            />
          )}
        </div>

        {/* Conteúdo do formulário */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6" style={{ color: form.theme?.primaryColor }}>
            {form.title}
          </h1>

          <FormRenderer
            fields={form.fields}
            theme={form.theme}
            values={answers}
            onChange={setAnswers}
          />

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isValid}
              className={`w-full py-3 rounded-lg transition-colors ${
                isLoading || !isValid
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isLoading 
                ? 'Enviando...' 
                : !isValid 
                  ? 'Preencha todos os campos obrigatórios'
                  : 'Enviar Respostas'
              }
            </button>
          </div>
        </div>
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