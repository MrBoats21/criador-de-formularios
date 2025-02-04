import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname.startsWith(path) 
      ? 'bg-gray-700 text-white' 
      : 'text-gray-300 hover:text-white hover:bg-gray-700';
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      signOut();
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 w-64 min-h-screen flex flex-col">
        <nav className="mt-10 px-6 space-y-1 flex-grow">
          <Link 
            to="/admin/dashboard" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/companies" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/companies')}`}
          >
            Empresas
          </Link>
          <Link 
            to="/admin/forms" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/forms')}`}
          >
            Meus Formulários
          </Link>
          <Link 
            to="/admin/form-builder" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/form-builder')}`}
          >
            Criar Formulário
          </Link>
          <Link 
            to="/admin/submissions" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/submissions')}`}
          >
            Submissões
          </Link>
        </nav>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-4 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors mt-auto mb-4"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto pt-10 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;