import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../contexts/FormContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from '../../components/Toast';
import { SignatureField } from '../../components/FormBuilder/SignatureField';
import { MaskedField } from '../../components/FormBuilder/MaskedField';

export default function FormSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms } = useForm();
  const { getCompany } = useCompany();
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const form = forms.find(f => f.id === Number(id));
  const company = form ? getCompany(form.companyId) : null;

  if (!form) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Formulário não encontrado.</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    form.fields.forEach(field => {
      const value = formData[field.id];
      const validations = field.validations || {};

      if (validations.required && !value) {
        newErrors[field.id] = 'Campo obrigatório';
        return;
      }

      switch (field.type) {
        case 'text':
        case 'textarea':
          if (validations.minLength && value?.length < validations.minLength) {
            newErrors[field.id] = `Mínimo ${validations.minLength} caracteres`;
          }
          if (validations.maxLength && value?.length > validations.maxLength) {
            newErrors[field.id] = `Máximo ${validations.maxLength} caracteres`;
          }
          break;

          case 'number': {
            const num = Number(value);
            if (validations.min && num < validations.min) {
              newErrors[field.id] = `Valor mínimo: ${validations.min}`;
            }
            if (validations.max && num > validations.max) {
              newErrors[field.id] = `Valor máximo: ${validations.max}`;
            }
            break;
          }

        case 'email':
          if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors[field.id] = 'Email inválido';
          }
          if (validations.customDomain && value) {
            const domain = value.split('@')[1];
            if (!domain || !validations.customDomain.includes(domain)) {
              newErrors[field.id] = `Domínio deve ser ${validations.customDomain}`;
            }
          }
          break;

        case 'file':
          if (value && validations.maxSize) {
            const sizeMB = value.size / (1024 * 1024);
            if (sizeMB > validations.maxSize) {
              newErrors[field.id] = `Arquivo deve ser menor que ${validations.maxSize}MB`;
            }
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Por favor, corrija os erros antes de enviar', type: 'error' });
      return;
    }

    try {
      // Aqui virá integração com backend
      console.log('Submissão:', {
        formId: form.id,
        userId: user.id,
        answers: formData,
        submittedAt: new Date()
      });

      setToast({ message: 'Formulário enviado com sucesso!', type: 'success' });
      setTimeout(() => {
        navigate('/forms');
      }, 2000);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao enviar formulário', type: 'error' });
    }
  };

  const renderField = (field) => {
    const baseInputClass = `w-full p-2 border rounded ${
      errors[field.id] ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            min={field.validations?.min}
            max={field.validations?.max}
            step={field.validations?.step}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            rows={field.validations?.rows || 4}
          />
        );

      case 'select':
        return (
          <select
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          >
            <option value="">Selecione</option>
            {field.validations?.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'multiSelect':
        return (
          <select
            multiple
            className={baseInputClass}
            value={formData[field.id] || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, opt => opt.value);
              setFormData({ ...formData, [field.id]: values });
            }}
          >
            {field.validations?.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return field.validations?.options ? (
          // Multiple checkboxes
          <div className="space-y-2">
            {field.validations.options.map((opt, i) => (
              <label key={i} className="flex items-center">
                <input
                  type="checkbox"
                  value={opt}
                  checked={(formData[field.id] || []).includes(opt)}
                  onChange={(e) => {
                    const currentValues = formData[field.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt]
                      : currentValues.filter(v => v !== opt);
                    setFormData({ ...formData, [field.id]: newValues });
                  }}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          // Single checkbox
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
              className="mr-2"
            />
            {field.label}
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.validations?.options?.map((opt, i) => (
              <label key={i} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={formData[field.id] === opt}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            min={field.validations?.minDate}
            max={field.validations?.maxDate}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            min={field.validations?.minTime}
            max={field.validations?.maxTime}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className={baseInputClass}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.files[0] })}
            accept={field.validations?.allowedTypes}
          />
        );

      case 'signature':
        return (
          <SignatureField
            onChange={(signatureData) => setFormData({ ...formData, [field.id]: signatureData })}
            width={field.validations?.width}
            height={field.validations?.height}
          />
        );

      case 'cpf':
      case 'cnpj':
      case 'cep':
      case 'phone':
        return (
          <MaskedField
            type={field.type}
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div 
        className="bg-white rounded-lg shadow"
        style={{ backgroundColor: company?.backgroundColor }}
      >
        {company?.logoUrl && (
          <div className="p-6 border-b flex items-center justify-center">
            <img 
              src={company.logoUrl} 
              alt="Logo da empresa" 
              className="h-16 object-contain"
            />
          </div>
        )}

        <div className="p-8">
          <h1 
            className="text-2xl font-bold mb-8"
            style={{ color: company?.primaryColor }}
          >
            {form.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <label 
                  className="block font-medium"
                  style={{ color: company?.secondaryColor }}
                >
                  {field.label}
                  {field.validations?.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/forms')}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded hover:bg-opacity-90"
                style={{ backgroundColor: company?.primaryColor }}
              >
                Enviar
              </button>
            </div>
          </form>
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