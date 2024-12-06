import { pool } from '../../config/database';

export const companyQueries = {
  async create(company) {
    const query = `
      INSERT INTO companies (name, background_color, primary_color, secondary_color, logo_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      company.name,
      company.backgroundColor,
      company.primaryColor,
      company.secondaryColor,
      company.logoUrl
    ]);
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM companies ORDER BY name');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM companies WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, company) {
    const query = `
      UPDATE companies 
      SET name = ?, background_color = ?, primary_color = ?, 
          secondary_color = ?, logo_url = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      company.name,
      company.backgroundColor,
      company.primaryColor,
      company.secondaryColor,
      company.logoUrl,
      id
    ]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM companies WHERE id = ?', [id]);
  },

  async getUsers(companyId) {
    const query = `
      SELECT u.* 
      FROM users u
      JOIN company_users cu ON u.id = cu.user_id
      WHERE cu.company_id = ?
    `;
    const [rows] = await pool.execute(query, [companyId]);
    return rows;
  },

  async getForms(companyId) {
    const query = `
      SELECT * FROM forms
      WHERE company_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.execute(query, [companyId]);
    return rows;
  }
};