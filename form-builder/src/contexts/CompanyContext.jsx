import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const CompanyContext = createContext(null);

function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  const getCompany = (id) => companies.find(company => company.id === id);

  const createCompany = async (companyData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/companies', companyData);
      setCompanies([...companies, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao criar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompany = async (id, data) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/companies/${id}`, data);
      setCompanies(companies.map(company => 
        company.id === id ? response.data : company
      ));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`/companies/${id}`);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Erro ao deletar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CompanyContext.Provider value={{ 
      companies,
      isLoading,
      error,
      getCompanies,
      getCompany,
      createCompany,
      updateCompany,
      deleteCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}

CompanyProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export { CompanyProvider, useCompany };