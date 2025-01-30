import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Layout } from './components/Layout/Layout';
import { PrivateRoute } from './routes/PrivateRoute';
import FormBuilder from './pages/FormBuilder';
import Companies from './pages/Companies';
import CreateCompany from './pages/Companies/CreateCompany';
import EditCompany from './pages/Companies/EditCompany';
import FormList from './pages/FormList';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { FormProvider } from './contexts/FormContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <FormProvider>
                <CompanyProvider>
                  <Layout />
                </CompanyProvider>
              </FormProvider>
            </PrivateRoute>
          }
        >
          <Route path="forms" element={<FormList />} />
          <Route path="form-builder" element={<FormBuilder />} />
          <Route path="form-builder/:id" element={<FormBuilder />} />
          <Route path="companies" element={<Companies />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies/create" element={<CreateCompany />} />
          <Route path="companies/:id/edit" element={<EditCompany />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;