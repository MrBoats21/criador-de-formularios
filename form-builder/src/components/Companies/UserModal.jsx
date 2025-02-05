import { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import { useCompany } from '../../contexts/CompanyContext';
import { Toast } from '../../components/Toast';

export function UserModal({ company, onClose }) {
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const { updateCompany } = useCompany();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedCompany = {
        ...company,
        users: [...(company.users || []), { ...newUser, role: 'user' }]
      };
      
      await updateCompany(company.id, updatedCompany);
      setNewUser({ name: '', email: '', password: '' });
      setToast({ message: 'Usuário adicionado com sucesso', type: 'success' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Erro ao adicionar usuário', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gerenciar Usuários</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Lista de usuários em dropdown */}
        <div className="mb-6">
          <button 
            onClick={() => setIsListOpen(!isListOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span className="font-medium">
                Usuários Cadastrados ({(company.users || []).length})
              </span>
            </div>
            {isListOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {isListOpen && (
            <div className="mt-2 border rounded-lg">
              {(company.users || []).length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhum usuário cadastrado
                </div>
              ) : (
                <div className="divide-y">
                  {(company.users || []).map((user, index) => (
                    <div key={index} className="p-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Formulário de novo usuário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-medium">Adicionar Novo Usuário</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              required
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Usuário'}
          </button>
        </form>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

UserModal.propTypes = {
  company: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default UserModal;