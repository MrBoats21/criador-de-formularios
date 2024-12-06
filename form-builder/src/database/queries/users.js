import { pool } from '../../config/database';

export const userQueries = {
  async create(user) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      user.name,
      user.email,
      user.password,
      user.role
    ]);
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  },

  async update(id, user) {
    const query = `
      UPDATE users 
      SET name = ?, email = ?, role = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      user.name,
      user.email,
      user.role,
      id
    ]);
  },

  async updatePassword(id, password) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    await pool.execute(query, [password, id]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  },

  async findByCompanyId(companyId) {
    const query = `
      SELECT u.* 
      FROM users u
      JOIN company_users cu ON u.id = cu.user_id
      WHERE cu.company_id = ?
    `;
    const [rows] = await pool.execute(query, [companyId]);
    return rows;
  },

  async addToCompany(userId, companyId) {
    const query = `
      INSERT INTO company_users (user_id, company_id)
      VALUES (?, ?)
    `;
    await pool.execute(query, [userId, companyId]);
  },

  async removeFromCompany(userId, companyId) {
    const query = `
      DELETE FROM company_users 
      WHERE user_id = ? AND company_id = ?
    `;
    await pool.execute(query, [userId, companyId]);
  }
};