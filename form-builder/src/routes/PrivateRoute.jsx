import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children }) {
  const { signed } = useAuth();
  const hasToken = localStorage.getItem('token');

  if (!signed && !hasToken) {
    return <Navigate to="/login" />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};