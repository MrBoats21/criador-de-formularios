import { useState } from 'react';
import { Toast } from '../components/Toast';
import api from '../utils/api';

export default function RequestReset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users/reset-password', { email });
      setToast({
        type: 'success',
        message: 'Se o email existir, você receberá as instruções de recuperação'
      });
      setEmail('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Erro ao processar solicitação'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Recuperar Senha</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
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