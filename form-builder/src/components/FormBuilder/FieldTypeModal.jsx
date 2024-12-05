import { useState } from 'react';
import PropTypes from 'prop-types';
import { fieldTypes } from '../../utils/fieldTypes';

function ValidationField({ type, field, value, onChange }) {
  switch (type) {
    case 'checkbox':
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.label}
        </label>
      );

    case 'number':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      );

    case 'text':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'array':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <textarea
            rows={5}
            cols={33}
            className="w-full p-2 border rounded resize-y"
            placeholder="Uma opção por linha"
            value={Array.isArray(value) ? value.join('\n') : ''}
            onChange={(e) => {
              const newValue = e.target.value.split('\n');
              onChange(newValue);
            }}
          />
        </div>
      );

    case 'multiSelect':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={value || []}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, opt => opt.value);
              onChange(options);
            }}
          >
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'time':
    case 'date':
      return (
        <div>
          <label className="block text-sm mb-1">{field.label}</label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      );

    default:
      return null;
  }
}

ValidationField.propTypes = {
  type: PropTypes.oneOf(['checkbox', 'number', 'text', 'select', 'array', 'multiSelect', 'time', 'date']).isRequired,
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

export function FieldTypeModal({ onAdd, onClose }) {
  const [fieldConfig, setFieldConfig] = useState({
    type: 'text',
    validations: {}
  });

  const handleValidationChange = (key, value) => {
    setFieldConfig({
      ...fieldConfig,
      validations: {
        ...fieldConfig.validations,
        [key]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Adicionar Campo</h3>
        
        <select
          className="w-full p-2 border rounded mb-4"
          value={fieldConfig.type}
          onChange={(e) => setFieldConfig({ 
            type: e.target.value,
            validations: {}
          })}
        >
          {Object.entries(fieldTypes).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>

        <div className="space-y-4 mb-4">
          {Object.entries(fieldTypes[fieldConfig.type].validations).map(([key, field]) => (
            <ValidationField
              key={key}
              type={field.type}
              field={field}
              value={fieldConfig.validations[key]}
              onChange={(value) => handleValidationChange(key, value)}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAdd(fieldConfig)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

FieldTypeModal.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FieldTypeModal;
