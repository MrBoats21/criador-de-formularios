import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import UserLayout from './components/Layout/UserLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import Companies from './pages/Companies';
import FormList from './pages/FormList';
import CreateCompany from './pages/Companies/CreateCompany';
import EditCompany from './pages/Companies/EditCompany';
import UserForms from './pages/UserForms';
import FormSubmission from './pages/UserForms/FormSubmission';
import { FormProvider } from './contexts/FormContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <FormProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Admin */}
            <Route path="/admin" element={
              <PrivateRoute role="admin">
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="forms" element={<FormList />} />
              <Route path="form-builder" element={<FormBuilder />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/create" element={<CreateCompany />} />
              <Route path="companies/:id/edit" element={<EditCompany />} />
              <Route index element={<Navigate to="/admin/dashboard" />} />
            </Route>

            {/* Rotas User */}
            <Route path="/" element={
              <PrivateRoute role="user">
                <UserLayout />
              </PrivateRoute>
            }>
              <Route path="forms" element={<UserForms />} />
              <Route path="forms/:id" element={<FormSubmission />} />
              <Route index element={<Navigate to="/forms" />} />
            </Route>
          </Routes>
        </FormProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;