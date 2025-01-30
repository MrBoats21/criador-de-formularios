import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const FormContext = createContext(null);

function FormProvider({ children }) {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getForms();
  }, []);

  const getForms = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/forms');
      setForms(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar formulários');
    } finally {
      setIsLoading(false);
    }
  };

  const getForm = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/forms/${id}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao carregar formulário');
    } finally {
      setIsLoading(false);
    }
  };

  const createForm = async (formData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/forms', formData);
      setForms([...forms, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao criar formulário');
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = async (id, formData) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/forms/${id}`, formData);
      setForms(forms.map(form => 
        form.id === id ? response.data : form
      ));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar formulário');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteForm = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/forms/${id}`);
      setForms(forms.filter(form => form.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao deletar formulário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContext.Provider value={{ 
      forms,
      currentForm,
      setCurrentForm,
      isLoading,
      error,
      getForms,
      getForm,
      createForm,
      updateForm,
      deleteForm
    }}>
      {children}
    </FormContext.Provider>
  );
}

FormProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { FormProvider, useForm };