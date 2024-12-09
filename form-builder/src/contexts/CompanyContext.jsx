import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { companyService } from '../services/companyService';

const CompanyContext = createContext(null);

function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await companyService.getAll();
      setCompanies(response.data);
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const createCompany = async (companyData) => {
    try {
      let logoUrl = null;
      if (companyData.logoFile) {
        logoUrl = await convertFileToBase64(companyData.logoFile);
      }

      const dataToSend = {
        ...companyData,
        logoUrl,
        createdAt: new Date().toISOString(),
        users: companyData.users || []
      };
      delete dataToSend.logoFile;

      const response = await companyService.create(dataToSend);
      setCompanies([...companies, response.data]);
      return response.data;
    } catch (err) {
      setError('Erro ao criar empresa');
      throw err;
    }
  };

  const updateCompany = async (id, data) => {
    try {
      let logoUrl = data.logoUrl;
      if (data.logoFile) {
        logoUrl = await convertFileToBase64(data.logoFile);
      }

      const dataToUpdate = {
        ...data,
        logoUrl,
        updatedAt: new Date().toISOString(),
        users: data.users || []
      };
      delete dataToUpdate.logoFile;

      const response = await companyService.update(id, dataToUpdate);
      setCompanies(companies.map(company => 
        company.id === id ? response.data : company
      ));
      return response.data;
    } catch (err) {
      setError('Erro ao atualizar empresa');
      throw err;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await companyService.delete(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (err) {
      setError('Erro ao excluir empresa');
      throw err;
    }
  };

  const getCompany = (id) => companies.find(company => company.id === Number(id));

  const getCompanyUsers = (companyId) => {
    return companies.find(company => company.id === Number(companyId))?.users || [];
  };

  const value = {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    getCompanyUsers,
    refreshCompanies: loadCompanies
  };

  return (
    <CompanyContext.Provider value={value}>
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