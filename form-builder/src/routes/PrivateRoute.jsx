import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children, role }) {
  const { user, signed } = useAuth();

  if (!signed) {
    return <Navigate to="/login" />;
  }

  // Se role é especificado, verifica se usuário tem permissão
  if (role && user?.role !== role) {
    // Redireciona admin para dashboard admin e user para lista de forms
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/forms'} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['admin', 'user'])
};

export default PrivateRoute;