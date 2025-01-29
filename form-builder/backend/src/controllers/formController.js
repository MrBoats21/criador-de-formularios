const pool = require('../config/database');

exports.createForm = async (req, res) => {
  try {
    const { title, companyId, fields, theme } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO forms (title, companyId, fields, theme) VALUES (?, ?, ?, ?)',
      [title, companyId, JSON.stringify(fields), JSON.stringify(theme)]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const [forms] = await pool.execute('SELECT * FROM forms');
    res.json(forms.map(form => ({
      ...form,
      fields: JSON.parse(form.fields),
      theme: JSON.parse(form.theme)
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, companyId, fields, theme } = req.body;
    await pool.execute(
      'UPDATE forms SET title = ?, companyId = ?, fields = ?, theme = ? WHERE id = ?',
      [title, companyId, JSON.stringify(fields), JSON.stringify(theme), id]
    );
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM forms WHERE id = ?', [id]);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};