import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';

export default function Companies() {
  const { companies, deleteCompany } = useCompany();

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      deleteCompany(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Empresas</h1>
        <Link 
          to="/admin/companies/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Nova Empresa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div 
            key={company.id} 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div 
              className="w-full h-32 rounded-lg mb-4 flex items-center justify-center"
              style={{ backgroundColor: company.backgroundColor }}
            >
              <img 
                src={company.logoUrl} 
                alt={company.name}
                className="max-h-24 max-w-full object-contain"
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: company.primaryColor }}
                title="Cor principal"
              />
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: company.secondaryColor }}
                title="Cor secundária"
              />
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {company.usersCount || 0} usuários vinculados
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/companies/${company.id}/edit`}
                className="text-blue-500 hover:text-blue-700"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(company.id)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}