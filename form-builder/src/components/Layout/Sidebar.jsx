import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700';
  };

  return (
    <aside className="bg-gray-800 w-64 min-h-screen">
      <nav className="mt-10 px-6 space-y-1">
        <Link 
          to="/dashboard" 
          className={`block py-2.5 px-4 rounded transition-colors ${isActive('/dashboard')}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/companies" 
          className={`block py-2.5 px-4 rounded transition-colors ${isActive('/companies')}`}
        >
          Empresas
        </Link>
        <Link 
          to="/forms" 
          className={`block py-2.5 px-4 rounded transition-colors ${isActive('/forms')}`}
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
  );
}