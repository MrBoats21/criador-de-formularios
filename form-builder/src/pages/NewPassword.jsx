import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from '../components/Toast';
import api from '../utils/api';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({
        type: 'error',
        message: 'As senhas não coincidem'
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/users/update-password', {
        token,
        newPassword: password
      });
      setToast({
        type: 'success',
        message: 'Senha atualizada com sucesso!'
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao atualizar senha'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Nova Senha</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
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