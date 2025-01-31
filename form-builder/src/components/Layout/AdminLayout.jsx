import { Link, useLocation, Outlet } from 'react-router-dom';

export function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) 
      ? 'bg-gray-700 text-white' 
      : 'text-gray-300 hover:text-white hover:bg-gray-700';
  };

  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 w-64 min-h-screen">
        <nav className="mt-10 px-6 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/admin/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/companies" 
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
            to="/form-builder" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/form-builder')}`}
          >
            Criar Formulário
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;