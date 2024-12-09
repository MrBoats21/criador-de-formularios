const db = require('../config/database');

exports.getAllForms = async (req, res) => {
  try {
    const [forms] = await db.execute('SELECT * FROM forms');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms', error });
  }
};

exports.getFormsByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const [forms] = await db.execute('SELECT * FROM forms WHERE company_id = ?', [companyId]);
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms', error });
  }
};

exports.createForm = async (req, res) => {
  const { title, fields, companyId, theme } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO forms (title, fields, company_id, theme) VALUES (?, ?, ?, ?)',
      [title, JSON.stringify(fields), companyId, JSON.stringify(theme)]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error creating form', error });
  }
};

exports.updateForm = async (req, res) => {
  const { id } = req.params;
  const { title, fields, theme } = req.body;
  try {
    await db.execute(
      'UPDATE forms SET title = ?, fields = ?, theme = ? WHERE id = ?',
      [title, JSON.stringify(fields), JSON.stringify(theme), id]
    );
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Error updating form', error });
  }
};

exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM forms WHERE id = ?', [id]);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting form', error });
  }
};