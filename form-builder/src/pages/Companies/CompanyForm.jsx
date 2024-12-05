import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateCompany } from '../../utils/companyValidation';
import { Toast } from '../../components/Toast';
import { UserSection } from '../../components/Companies/UserSection';

export function CompanyForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    backgroundColor: initialData?.backgroundColor || '#ffffff',
    primaryColor: initialData?.primaryColor || '#3b82f6',
    secondaryColor: initialData?.secondaryColor || '#1d4ed8',
    logoFile: null,
    users: initialData?.users || [],
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || null);

  const handleAddUser = (user) => {
    setFormData({
      ...formData,
      users: [...formData.users, user],
    });
  };

  const handleRemoveUser = (index) => {
    setFormData({
      ...formData,
      users: formData.users.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCompany(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setToast({ message: 'Corrija os erros antes de salvar', type: 'error' });
      return;
    }

    // Garante que 'users' será sempre um array ao enviar os dados
    const sanitizedData = { 
      ...formData, 
      users: Array.isArray(formData.users) ? formData.users : [] 
    };

    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setErrors({ ...errors, name: null });
          }}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) => {
                setFormData({ ...formData, backgroundColor: e.target.value });
                setErrors({ ...errors, backgroundColor: null });
              }}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={formData.backgroundColor}
              onChange={(e) => {
                setFormData({ ...formData, backgroundColor: e.target.value });
                setErrors({ ...errors, backgroundColor: null });
              }}
              className={`flex-1 p-2 border rounded-lg ${
                errors.backgroundColor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.backgroundColor && (
            <span className="text-red-500 text-sm">{errors.backgroundColor}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cor Principal</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => {
                setFormData({ ...formData, primaryColor: e.target.value });
                setErrors({ ...errors, primaryColor: null });
              }}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => {
                setFormData({ ...formData, primaryColor: e.target.value });
                setErrors({ ...errors, primaryColor: null });
              }}
              className={`flex-1 p-2 border rounded-lg ${
                errors.primaryColor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.primaryColor && (
            <span className="text-red-500 text-sm">{errors.primaryColor}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cor Secundária</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e) => {
                setFormData({ ...formData, secondaryColor: e.target.value });
                setErrors({ ...errors, secondaryColor: null });
              }}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={formData.secondaryColor}
              onChange={(e) => {
                setFormData({ ...formData, secondaryColor: e.target.value });
                setErrors({ ...errors, secondaryColor: null });
              }}
              className={`flex-1 p-2 border rounded-lg ${
                errors.secondaryColor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.secondaryColor && (
            <span className="text-red-500 text-sm">{errors.secondaryColor}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, logoFile: file });
              setErrors({ ...errors, logoFile: null });

              const reader = new FileReader();
              reader.onloadend = () => {
                setLogoPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
          className={`w-full p-2 border rounded-lg ${
            errors.logoFile ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.logoFile && <span className="text-red-500 text-sm">{errors.logoFile}</span>}

        {logoPreview && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div
              className="w-full h-32 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: formData.backgroundColor }}
            >
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-24 max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-6">
        <UserSection
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {initialData ? 'Atualizar' : 'Criar'} Empresa
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}

CompanyForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    backgroundColor: PropTypes.string,
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    logoUrl: PropTypes.string,
    users: PropTypes.array,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default CompanyForm;
