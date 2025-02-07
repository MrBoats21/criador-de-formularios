/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useCompany } from '../../contexts/CompanyContext';
import { Toast } from '../../components/Toast';
import api from '../../utils/api';

export function UserModal({ company, onClose }) {
 const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
 const [toast, setToast] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [isListOpen, setIsListOpen] = useState(true);
 const { updateCompany } = useCompany();
 const [users, setUsers] = useState(company.users || []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setIsLoading(true);
   try {
     const userData = {
       ...newUser,
       role: 'user',
       companyId: company.id
     };
     
     const response = await api.post('/users', userData);
     setUsers([...users, response.data]);
     setNewUser({ name: '', email: '', password: '' });
     setToast({ message: 'Usuário adicionado com sucesso', type: 'success' });
   } catch (error) {
     setToast({ message: error.response?.data?.message || 'Erro ao adicionar usuário', type: 'error' });
   } finally {
     setIsLoading(false);
   }
 };

 const handleDeleteUser = async (user) => {
   if (window.confirm('Tem certeza que deseja remover este usuário?')) {
     try {
       await api.delete(`/users/${user.id}/company/${company.id}`);
       setUsers(users.filter(u => u.id !== user.id));
       setToast({ message: 'Usuário removido com sucesso', type: 'success' });
     } catch (error) {
       setToast({ message: 'Erro ao remover usuário', type: 'error' });
     }
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

       <div className="mb-6">
         <button 
           onClick={() => setIsListOpen(!isListOpen)}
           className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
         >
           <div className="flex items-center gap-2">
             <Users size={20} />
             <span className="font-medium">
               Usuários Cadastrados ({users.length})
             </span>
           </div>
           {isListOpen ? <ChevronUp /> : <ChevronDown />}
         </button>
         
         {isListOpen && (
           <div className="mt-2 border rounded-lg">
             {users.length === 0 ? (
               <div className="p-4 text-center text-gray-500">
                 Nenhum usuário cadastrado
               </div>
             ) : (
               <div className="divide-y">
                 {users.map((user, index) => (
                   <div key={index} className="p-4 flex justify-between items-center">
                     <div>
                       <p className="font-medium">{user.name}</p>
                       <p className="text-sm text-gray-500">{user.email}</p>
                     </div>
                     <button
                       onClick={() => handleDeleteUser(user)}
                       className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                       title="Remover usuário"
                     >
                       <Trash2 size={20} />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         )}
       </div>

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