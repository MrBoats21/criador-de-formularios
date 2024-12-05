import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CompanyContext = createContext(null);

function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem('companies');
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });

  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  const createCompany = async (companyData) => {
    try {
      let logoUrl = null;
      if (companyData.logoFile) {
        logoUrl = await convertFileToBase64(companyData.logoFile);
      }

      const newCompany = {
        id: Date.now(),
        ...companyData,
        logoUrl,
        createdAt: new Date().toISOString(),
        users: companyData.users || []
      };

      delete newCompany.logoFile;
      setCompanies([...companies, newCompany]);

      // Salvar os usuários
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const newUsers = (Array.isArray(companyData.users) ? companyData.users : []).map(user => ({
        ...user,
        companyId: newCompany.id,
        createdAt: new Date().toISOString()
      }));
      localStorage.setItem('users', JSON.stringify([...existingUsers, ...newUsers]));

      return newCompany;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  };

  const updateCompany = async (id, data) => {
    try {
      let logoUrl = data.logoUrl;
      if (data.logoFile) {
        logoUrl = await convertFileToBase64(data.logoFile);
      }

      const updatedCompanies = companies.map(company => 
        company.id === id 
          ? { 
              ...company, 
              ...data, 
              logoUrl: logoUrl || company.logoUrl,
              users: data.users || company.users
            } 
          : company
      );

      setCompanies(updatedCompanies);

      // Atualizar usuários
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = existingUsers.filter(user => user.companyId !== id);
      const newUsers = (Array.isArray(data.users) ? data.users : []).map(user => ({
        ...user,
        companyId: id,
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem('users', JSON.stringify([...updatedUsers, ...newUsers]));
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  };

  const deleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
    
    // Remover usuários da empresa
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.filter(user => user.companyId !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getCompany = (id) => companies.find(company => company.id === id);

  const getCompanyUsers = (companyId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter(user => user.companyId === companyId);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const value = {
    companies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompany,
    getCompanyUsers
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