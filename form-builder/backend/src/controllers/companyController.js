const pool = require('../config/database');

const companyController = {
  getCompanies: async (req, res) => {
    try {
      const [companies] = await pool.execute('SELECT * FROM companies');
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCompany: async (req, res) => {
    try {
      const { 
        name = '', 
        backgroundColor = '#FFFFFF', 
        primaryColor = '#000000', 
        secondaryColor = '#000000' 
      } = req.body;

      // Garantir que todos os valores sejam não-nulos
      const logoUrl = req.body.logoUrl || null;

      const [result] = await pool.execute(
        'INSERT INTO companies (name, backgroundColor, primaryColor, secondaryColor, logoUrl) VALUES (?, ?, ?, ?, ?)',
        [
          name,
          backgroundColor,
          primaryColor,
          secondaryColor,
          logoUrl
        ]
      );

      const newCompany = {
        id: result.insertId,
        name,
        backgroundColor,
        primaryColor,
        secondaryColor,
        logoUrl
      };

      res.status(201).json(newCompany);
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ message: error.message });
    }
  },

  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        name = '', 
        backgroundColor = '#FFFFFF', 
        primaryColor = '#000000', 
        secondaryColor = '#000000',
        logoUrl = null 
      } = req.body;
      
      await pool.execute(
        'UPDATE companies SET name = ?, backgroundColor = ?, primaryColor = ?, secondaryColor = ?, logoUrl = ? WHERE id = ?',
        [name, backgroundColor, primaryColor, secondaryColor, logoUrl, id]
      );

      res.json({ 
        id: Number(id), 
        name, 
        backgroundColor, 
        primaryColor, 
        secondaryColor, 
        logoUrl 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCompany: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM companies WHERE id = ?', [id]);
      res.json({ message: 'Company deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = companyController;