import { useState } from 'react';
import { SignatureField } from './SignatureField';
import { MaskedField } from './MaskedField';
import PropTypes from 'prop-types';

export function FormPreview({ fields, title, theme }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const getTextSize = () => {
    const sizes = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };
    return sizes[theme?.fontSize || 'base'];
  };

  const validateField = (field, value) => {
    const validations = field.validations || {};
    
    if (validations.required && !value) {
      return 'Campo obrigatório';
    }

    switch (field.type) {
      case 'text':
      case 'textarea':
        if (validations.minLength && value.length < validations.minLength) {
          return `Mínimo ${validations.minLength} caracteres`;
        }
        if (validations.maxLength && value.length > validations.maxLength) {
          return `Máximo ${validations.maxLength} caracteres`;
        }
        break;

      case 'number':
        if (validations.min && Number(value) < validations.min) {
          return `Valor mínimo: ${validations.min}`;
        }
        if (validations.max && Number(value) > validations.max) {
          return `Valor máximo: ${validations.max}`;
        }
        break;

      case 'email':
        if (value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return 'Email inválido';
        }
        if (validations.customDomain && value) {
          const domain = value.split('@')[1];
          if (!validations.customDomain.includes(domain)) {
            return `Domínio deve ser ${validations.customDomain}`;
          }
        }
        break;

      case 'multiSelect':
        if (validations.minSelect && value.length < validations.minSelect) {
          return `Selecione no mínimo ${validations.minSelect} opções`;
        }
        if (validations.maxSelect && value.length > validations.maxSelect) {
          return `Selecione no máximo ${validations.maxSelect} opções`;
        }
        break;

      case 'file':
        if (value && validations.maxSize) {
          const sizeMB = value.size / (1024 * 1024);
          if (sizeMB > validations.maxSize) {
            return `Arquivo deve ser menor que ${validations.maxSize}MB`;
          }
        }
        break;
    }

    return null;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field.id]: value });
    const error = validateField(field, value);
    setErrors({ ...errors, [field.id]: error });
  };

  const renderField = (field) => {
    const baseInputClass = `w-full p-2 border rounded ${
      errors[field.id] ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
        return (
          <input 
            type="text"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            minLength={field.validations?.minLength}
            maxLength={field.validations?.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            rows={field.validations?.rows || 3}
          />
        );

      case 'number':
        return (
          <input 
            type="number"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            min={field.validations?.min}
            max={field.validations?.max}
            step={field.validations?.step}
          />
        );

      case 'email':
        return (
          <input 
            type="email"
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            className={baseInputClass}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
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
              handleChange(field, values);
            }}
          >
            {field.validations?.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleChange(field, e.target.checked)}
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
                  checked={(formData[field.id] || '') === opt}
                  onChange={(e) => handleChange(field, e.target.value)}
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
            onChange={(e) => handleChange(field, e.target.value)}
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
            onChange={(e) => handleChange(field, e.target.value)}
            min={field.validations?.minTime}
            max={field.validations?.maxTime}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className={baseInputClass}
            onChange={(e) => handleChange(field, e.target.files[0])}
            accept={field.validations?.allowedTypes?.join(',')}
          />
        );

      case 'signature':
        return (
          <SignatureField
            onChange={(signatureData) => handleChange(field, signatureData)}
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
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg shadow overflow-hidden">
      {/* Header com logo */}
      <div 
        className="p-6 flex items-center justify-center border-b"
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        {theme?.logoUrl && (
          <img 
            src={theme.logoUrl} 
            alt="Logo" 
            className="h-12 object-contain"
          />
        )}
      </div>

      {/* Conteúdo do formulário */}
      <div 
        className={`${getTextSize()}`}
        style={{ 
          backgroundColor: theme?.backgroundColor,
          fontFamily: theme?.fontFamily || 'Arial',
          '--primary-color': theme?.primaryColor || '#3b82f6',
          '--secondary-color': theme?.secondaryColor || '#1d4ed8'
        }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8" style={{color: theme?.primaryColor}}>
            {title || 'Preview do Formulário'}
          </h2>
          
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="rounded-lg bg-white/50 p-4 transition-colors">
                <label className="block mb-2 font-medium" style={{color: theme?.secondaryColor}}>
                  {field.label || 'Campo sem nome'}
                  {field.validations?.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <span className="text-red-500 text-sm mt-1 block">{errors[field.id]}</span>
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}

FormPreview.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      validations: PropTypes.object
    })
  ).isRequired,
  title: PropTypes.string,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    logoUrl: PropTypes.string
  })
};