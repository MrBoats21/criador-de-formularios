import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AdminLayout } from './components/Layout/AdminLayout'; // era Layout
import { UserLayout } from './components/Layout/UserLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import FormBuilder from './pages/FormBuilder';
import Companies from './pages/Companies';
import CreateCompany from './pages/Companies/CreateCompany';
import EditCompany from './pages/Companies/EditCompany';
import FormList from './pages/FormList';
import UserForms from './pages/UserForms';
import FormFill from './pages/FormFill';
import UserSubmissions from './pages/UserSubmissions';
import AdminSubmissions from './pages/AdminSubmissions';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { FormProvider } from './contexts/FormContext';
import { SubmissionProvider } from './contexts/SubmissionContext';

function App() {
  return (
    <AuthProvider>
      <FormProvider>
        <CompanyProvider>
          <SubmissionProvider>
            <Routes>
              {/* Rota de Login */}
              <Route path="/login" element={<Login />} />

              {/* Redirecionamento padrão */}
              <Route path="/" element={<Navigate to="/login" />} />

              {/* Rotas Admin */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute role="admin">
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route path="companies/create" element={<CreateCompany />} />
                <Route path="companies/:id/edit" element={<EditCompany />} />
                <Route path="companies" element={<Companies />} />
                <Route path="form-builder/:id" element={<FormBuilder />} />
                <Route path="form-builder" element={<FormBuilder />} />
                <Route path="forms" element={<FormList />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route index element={<Navigate to="dashboard" />} />
              </Route>

              {/* Rotas Usuário */}
              <Route
                path="/user"
                element={
                  <PrivateRoute role="user"> {/* Verifica se o usuário é user */}
                    <UserLayout />
                  </PrivateRoute>
                }
              >
                <Route path="my-forms" element={<UserForms />} />
                <Route path="form/:id/fill" element={<FormFill />} />
                <Route path="submissions" element={<UserSubmissions />} />
                <Route index element={<Navigate to="my-forms" />} />
              </Route>

              {/* Rota de Fallback (caso a rota não exista) */}
              <Route path="*" element={<Navigate to={localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/user/my-forms'} />} />
            </Routes>
          </SubmissionProvider>
        </CompanyProvider>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;