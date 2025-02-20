import { useState } from 'react';
import PropTypes from 'prop-types';
import { createUser } from '../../services/userService';
import { Toast } from '../../components/Toast';

export function UserSection({ users = [], onAddUser, onRemoveUser }) {
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = { ...newUser, role: 'user' };
      const createdUser = await createUser(userData);
      onAddUser(createdUser);
      setNewUser({ name: '', email: '', password: '' });
      setShowAddForm(false);
      setToast({ 
        type: 'success', 
        message: 'Usuário criado com sucesso. Um email foi enviado com as credenciais.' 
      });
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erro ao criar usuário' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Usuários</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="text-blue-500 hover:text-blue-700"
        >
          + Adicionar Usuário
        </button>
      </div>

      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveUser(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Adicionar Usuário</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

UserSection.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    })
  ),
  onAddUser: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired
};

export default UserSection;