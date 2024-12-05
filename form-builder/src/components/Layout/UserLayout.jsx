import { Link, useLocation, Outlet } from 'react-router-dom';

export function UserLayout() {
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
            to="/forms" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/forms')}`}
          >
            Formulários Disponíveis
          </Link>
          <Link 
            to="/submissions" 
            className={`block py-2.5 px-4 rounded transition-colors ${isActive('/submissions')}`}
          >
            Minhas Respostas
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto pt-10 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;