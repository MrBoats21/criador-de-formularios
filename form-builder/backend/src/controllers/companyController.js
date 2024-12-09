const db = require('../config/database');

exports.getAllCompanies = async (req, res) => {
  try {
    const [companies] = await db.execute('SELECT * FROM companies');
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};

exports.createCompany = async (req, res) => {
  const { name, backgroundColor, primaryColor, secondaryColor } = req.body;

  // Sobrescrevendo o valor de logoUrl
  const logoUrl = "teste logo";

  // Validação básica
  if (!name || !backgroundColor || !primaryColor || !secondaryColor) {
    return res.status(400).json({ message: 'All fields except logoUrl are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO companies (name, backgroundColor, primaryColor, secondaryColor, logoUrl) VALUES (?, ?, ?, ?, ?)',
      [name, backgroundColor, primaryColor, secondaryColor, logoUrl]
    );

    res.status(201).json({ id: result.insertId, name, backgroundColor, primaryColor, secondaryColor, logoUrl });
  } catch (error) {
    console.error('Error creating company:', error.message);
    res.status(500).json({ message: 'Error creating company', error });
  }
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, backgroundColor, primaryColor, secondaryColor } = req.body;

  // Sobrescrevendo o valor de logoUrl
  const logoUrl = "teste logo";

  if (!name || !backgroundColor || !primaryColor || !secondaryColor) {
    return res.status(400).json({ message: 'All fields except logoUrl are required' });
  }

  try {
    await db.execute(
      'UPDATE companies SET name = ?, backgroundColor = ?, primaryColor = ?, secondaryColor = ?, logoUrl = ? WHERE id = ?',
      [name, backgroundColor, primaryColor, secondaryColor, logoUrl, id]
    );

    res.json({ id, name, backgroundColor, primaryColor, secondaryColor, logoUrl });
  } catch (error) {
    console.error('Error updating company:', error.message);
    res.status(500).json({ message: 'Error updating company', error });
  }
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM companies WHERE id = ?', [id]);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error.message);
    res.status(500).json({ message: 'Error deleting company', error });
  }
};