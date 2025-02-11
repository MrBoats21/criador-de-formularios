import PropTypes from 'prop-types';
import { MaskedField } from '../FormBuilder/MaskedField';
import { SignatureField } from '../FormBuilder/SignatureField';

export function FormRenderer({ fields, theme, values, onChange }) {
  const handleFieldChange = (fieldId, value, fieldLabel) => {
    onChange({
      ...values,
      [fieldId]: {
        label: fieldLabel,
        value: value
      }
    });
  };

  const renderField = (field) => {
    const baseInputClass = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={baseInputClass}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            required={field.validations?.required}
            minLength={field.validations?.minLength}
            maxLength={field.validations?.maxLength}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={baseInputClass}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            required={field.validations?.required}
            rows={field.validations?.rows || 3}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={baseInputClass}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            required={field.validations?.required}
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
              value={values[field.id]?.value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
              required={field.validations?.required}
            />
          );
        
        case 'time':
          return (
            <input
              type="time"
              className={baseInputClass}
              value={values[field.id]?.value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
              required={field.validations?.required}
            />
          );
        
        case 'multiSelect':
          return (
            <select
              multiple
              className={baseInputClass}
              value={values[field.id]?.value || []}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                handleFieldChange(field.id, selectedOptions, field.label);
              }}
              required={field.validations?.required}
            >
              {field.validations?.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          );

      case 'select':
        return (
          <select
            className={baseInputClass}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            required={field.validations?.required}
          >
            <option value="">Selecione...</option>
            {field.validations?.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.validations?.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={(values[field.id]?.value || '') === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
                  required={field.validations?.required}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={values[field.id]?.value || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked, field.label)}
              required={field.validations?.required}
              className="mr-2"
            />
            {field.label}
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            className={baseInputClass}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            required={field.validations?.required}
            min={field.validations?.minDate}
            max={field.validations?.maxDate}
          />
        );

        case 'file':
          return (
            <input
              type="file"
              className={baseInputClass}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    handleFieldChange(field.id, {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      data: event.target.result
                    }, field.label);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              required={field.validations?.required}
              accept={field.validations?.allowedTypes}
            />
          );

      case 'signature':
        return (
          <SignatureField
            onChange={(signatureData) => handleFieldChange(field.id, signatureData, field.label)}
            width={field.validations?.width || 400}
            height={field.validations?.height || 200}
            required={field.validations?.required}
          />
        );

      case 'cpf':
      case 'cnpj':
      case 'cep':
      case 'phone':
        return (
          <MaskedField
            type={field.type}
            value={values[field.id]?.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value, field.label)}
            className={baseInputClass}
            required={field.validations?.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="space-y-6" 
      style={{ 
        fontFamily: theme?.fontFamily,
        backgroundColor: theme?.backgroundColor || 'white'
      }}
    >
      {fields.map((field) => (
        <div key={field.id} className="rounded-lg p-4">
          <label className="block mb-2 font-medium" style={{ color: theme?.primaryColor }}>
            {field.label}
            {field.validations?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}

FormRenderer.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string,
      validations: PropTypes.object
    })
  ).isRequired,
  theme: PropTypes.object,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FormRenderer;