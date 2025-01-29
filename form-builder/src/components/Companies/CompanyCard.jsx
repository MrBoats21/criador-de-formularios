import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export function CompanyCard({ company, onDelete }) {
  return (
    <div key={company.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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
        {company.users?.length || 0} usuários vinculados
      </div>

      <div className="flex gap-2">
        <Link
          to={`admin/companies/${company.id}/edit`}
            className="text-blue-500 hover:text-blue-700"
          >
           Editar  
      </Link>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(company.id)}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

CompanyCard.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    users: PropTypes.array
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CompanyCard;