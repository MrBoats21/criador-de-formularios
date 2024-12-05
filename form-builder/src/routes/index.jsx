import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { PrivateRoute } from './PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <div>Dashboard</div>
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;