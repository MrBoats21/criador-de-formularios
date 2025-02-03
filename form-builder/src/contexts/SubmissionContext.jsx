import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const SubmissionContext = createContext(null);

function SubmissionProvider({ children }) {
 const [submissions, setSubmissions] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);

 const submitForm = async (formId, answers) => {
   try {
     setIsLoading(true);
     const response = await api.post('/submissions', {
       formId,
       answers
     });
     return response.data;
   } catch (err) {
     throw new Error(err.response?.data?.message || 'Erro ao enviar formulário');
   } finally {
     setIsLoading(false);
   }
 };

 const getSubmissions = async () => {
   try {
     setIsLoading(true);
     const response = await api.get('/submissions');
     setSubmissions(response.data);
     return response.data;
   } catch (err) {
     console.error('Error:', err);
     setError(err.response?.data?.message || 'Erro ao carregar submissões');
   } finally {
     setIsLoading(false);
   }
 };

 const getAllSubmissions = async () => {
   try {
     setIsLoading(true);
     const response = await api.get('/submissions/all');
     return response.data;
   } catch (err) {
     throw new Error(err.response?.data?.message || 'Erro ao carregar submissões');
   } finally {
     setIsLoading(false);
   }
 };

 const getFormSubmissions = async (formId) => {
   try {
     setIsLoading(true);
     const response = await api.get(`/submissions/form/${formId}`);
     return response.data;
   } catch (err) {
     throw new Error(err.response?.data?.message || 'Erro ao carregar submissões');
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <SubmissionContext.Provider value={{
     submissions,
     isLoading,
     error,
     submitForm,
     getSubmissions,
     getFormSubmissions,
     getAllSubmissions
   }}>
     {children}
   </SubmissionContext.Provider>
 );
}

function useSubmission() {
 const context = useContext(SubmissionContext);
 if (!context) {
   throw new Error('useSubmission must be used within a SubmissionProvider');
 }
 return context;
}

SubmissionProvider.propTypes = {
 children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export { SubmissionProvider, useSubmission };