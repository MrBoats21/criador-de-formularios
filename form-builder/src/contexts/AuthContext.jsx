import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = async (credentials) => {
    try {
      // Simulação de autenticação
      const userData = {
        id: 1,
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user',
        name: 'Usuário Teste'
      };

      setUser(userData);
      localStorage.setItem('formBuilder:user', JSON.stringify(userData));
      
      return userData;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new Error('Erro na autenticação');
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('formBuilder:user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        signOut, 
        signed: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };