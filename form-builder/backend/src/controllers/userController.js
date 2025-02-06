const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const pool = require('../config/database');

const userController = {
 createUser: async (req, res) => {
   try {
     const { name, email, password, role, companyId } = req.body;

     // Verificar se email já existe
     const [existingUsers] = await pool.execute(
       'SELECT id FROM users WHERE email = ?',
       [email]
     );

     if (existingUsers.length > 0) {
       return res.status(400).json({ message: 'Email já cadastrado' });
     }

     // Hash da senha
     const hashedPassword = await bcrypt.hash(password, 10);
     console.log('Criando usuário...');

     // Criar usuário
     const [result] = await pool.execute(
       'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
       [name, email, hashedPassword, role || 'user']
     );

     const userId = result.insertId;
     console.log('Usuário criado com ID:', userId);

     // Criar relação com a empresa
     console.log('Criando relação com empresa...');

     await pool.execute(
       'INSERT INTO company_users (company_id, user_id) VALUES (?, ?)',
       [companyId, userId]
     );

     // Enviar email
     try {
       await sendWelcomeEmail(email, password);
     } catch (emailError) {
       console.error('Erro ao enviar email:', emailError);
     }

     res.status(201).json({ 
       id: userId,
       name,
       email,
       role
     });
   } catch (error) {
     console.error('Erro ao criar usuário:', error);
     res.status(500).json({ message: 'Erro ao criar usuário' });
   }
 },

 getUsersByCompany: async (req, res) => {
   try {
     const { companyId } = req.params;
     const [users] = await pool.execute(
       `SELECT u.id, u.name, u.email, u.role 
        FROM users u 
        JOIN company_users cu ON u.id = cu.user_id 
        WHERE cu.company_id = ?`,
       [companyId]
     );
     res.json(users);
   } catch (error) {
     console.error('Erro ao buscar usuários da empresa:', error);
     res.status(500).json({ message: 'Erro ao buscar usuários' });
   }
 },

  deleteUserFromCompany: async (req, res) => {
    try {
      const { userId, companyId } = req.params;

      // Primeiro remove o vínculo
      await pool.execute(
        'DELETE FROM company_users WHERE user_id = ? AND company_id = ?',
        [userId, companyId]
      );

      // Depois remove o usuário
      await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
  },

 resetPassword: async (req, res) => {
   try {
     const { email } = req.body;
     
     // Verificar se o usuário existe
     const [users] = await pool.execute(
       'SELECT id FROM users WHERE email = ?',
       [email]
     );

     if (users.length === 0) {
       return res.status(404).json({ message: 'Email não encontrado' });
     }

     // Gerar token temporário
     const resetToken = crypto.randomBytes(20).toString('hex');
     const resetExpires = new Date(Date.now() + 3600000); // 1 hora

     // Salvar token no banco
     await pool.execute(
       'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
       [resetToken, resetExpires, users[0].id]
     );

     // Enviar email
     await sendPasswordResetEmail(email, resetToken);

     res.json({ message: 'Email de recuperação enviado com sucesso' });
   } catch (error) {
     console.error('Erro ao resetar senha:', error);
     res.status(500).json({ message: 'Erro ao processar solicitação' });
   }
 },

 updatePassword: async (req, res) => {
   try {
     const { token, newPassword } = req.body;

     const [users] = await pool.execute(
       'SELECT id FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
       [token, new Date()]
     );

     if (users.length === 0) {
       return res.status(400).json({ message: 'Token inválido ou expirado' });
     }

     const hashedPassword = await bcrypt.hash(newPassword, 10);

     await pool.execute(
       'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
       [hashedPassword, users[0].id]
     );

     res.json({ message: 'Senha atualizada com sucesso' });
   } catch (error) {
     console.error('Erro ao atualizar senha:', error);
     res.status(500).json({ message: 'Erro ao atualizar senha' });
   }
 }
};

module.exports = userController;