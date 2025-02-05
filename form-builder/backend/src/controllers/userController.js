import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../services/emailService.js';
import pool from '../config/database.js';

const userController = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

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

      // Criar usuário
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'user']
      );

      // Enviar email
      try {
        await sendWelcomeEmail(email, password);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não impede a criação do usuário se o email falhar
      }

      res.status(201).json({ 
        id: result.insertId,
        name,
        email,
        role
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
          'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
          [name, email, hashedPassword, role, id]
        );
      } else {
        await pool.execute(
          'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
          [name, email, role, id]
        );
      }

      res.json({ 
        id: Number(id),
        name,
        email,
        role
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
  },

  getUsers: async (req, res) => {
    try {
      const [users] = await pool.execute(
        'SELECT id, name, email, role FROM users'
      );
      res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  }
};

export default userController;