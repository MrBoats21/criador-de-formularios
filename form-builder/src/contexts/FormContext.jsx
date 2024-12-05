import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormContext = createContext({});

function FormProvider({ children }) {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);

  useEffect(() => {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  const saveForm = (formData) => {
    const newForms = currentForm
      ? forms.map(f => f.id === currentForm ? { ...formData, id: currentForm } : f)
      : [...forms, { ...formData, id: Date.now() }];
    
    setForms(newForms);
    localStorage.setItem('forms', JSON.stringify(newForms));
  };

  const deleteForm = (formId) => {
    const newForms = forms.filter(f => f.id !== formId);
    setForms(newForms);
    localStorage.setItem('forms', JSON.stringify(newForms));
  };

  return (
    <FormContext.Provider value={{ forms, currentForm, setCurrentForm, saveForm, deleteForm }}>
      {children}
    </FormContext.Provider>
  );
}

function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

FormProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export { FormProvider, useForm };