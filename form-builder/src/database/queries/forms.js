import { pool } from '../../config/database';

export const formQueries = {
  async create(form) {
    const query = `
      INSERT INTO forms (title, company_id, fields)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      form.title,
      form.companyId,
      JSON.stringify(form.fields)
    ]);
    return result.insertId;
  },

  async findAll() {
    const query = `
      SELECT f.*, c.name as company_name,
             c.background_color, c.primary_color, c.secondary_color, c.logo_url
      FROM forms f
      LEFT JOIN companies c ON f.company_id = c.id
      ORDER BY f.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async findById(id) {
    const query = `
      SELECT f.*, c.name as company_name,
             c.background_color, c.primary_color, c.secondary_color, c.logo_url
      FROM forms f
      LEFT JOIN companies c ON f.company_id = c.id
      WHERE f.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  async update(id, form) {
    const query = `
      UPDATE forms 
      SET title = ?, company_id = ?, fields = ?
      WHERE id = ?
    `;
    await pool.execute(query, [
      form.title,
      form.companyId,
      JSON.stringify(form.fields),
      id
    ]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM forms WHERE id = ?', [id]);
  },

  async createSubmission(submission) {
    const query = `
      INSERT INTO form_submissions (form_id, user_id, answers, status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      submission.formId,
      submission.userId,
      JSON.stringify(submission.answers),
      submission.status || 'completed'
    ]);
    return result.insertId;
  },

  async getSubmissions(formId) {
    const query = `
      SELECT fs.*, u.name as user_name, u.email as user_email
      FROM form_submissions fs
      JOIN users u ON fs.user_id = u.id
      WHERE fs.form_id = ?
      ORDER BY fs.submitted_at DESC
    `;
    const [rows] = await pool.execute(query, [formId]);
    return rows;
  },

  async getUserSubmissions(userId) {
    const query = `
      SELECT fs.*, f.title as form_title, c.name as company_name
      FROM form_submissions fs
      JOIN forms f ON fs.form_id = f.id
      JOIN companies c ON f.company_id = c.id
      WHERE fs.user_id = ?
      ORDER BY fs.submitted_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }
};