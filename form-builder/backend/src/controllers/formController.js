const pool = require('../config/database');

const formController = {
  getForms: async (req, res) => {
    try {
      const [forms] = await pool.execute('SELECT * FROM forms');
      const formattedForms = forms.map(form => {
        let parsedFields = [];
        let parsedTheme = null;

        try {
          parsedFields = typeof form.fields === 'string' 
            ? JSON.parse(form.fields) 
            : form.fields || [];
        } catch (error) {
          console.error('Error parsing fields:', error);
        }

        try {
          parsedTheme = typeof form.theme === 'string' 
            ? JSON.parse(form.theme) 
            : form.theme;
        } catch (error) {
          console.error('Error parsing theme:', error);
        }

        return {
          ...form,
          fields: parsedFields,
          theme: parsedTheme
        };
      });

      res.json(formattedForms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getForm: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
   
      // Verifica se usuário já respondeu
      const [submissions] = await pool.execute(
        'SELECT id FROM form_submissions WHERE formId = ? AND userId = ?',
        [id, userId]
      );
   
      if (submissions.length > 0) {
        return res.status(403).json({ 
          message: 'Você já respondeu este formulário.',
          alreadySubmitted: true 
        });
      }
   
      const [forms] = await pool.execute('SELECT * FROM forms WHERE id = ?', [id]);
      
      if (forms.length === 0) {
        return res.status(404).json({ message: 'Formulário não encontrado' });
      }
   
      const form = forms[0];
      let parsedFields = [];
      let parsedTheme = null;
   
      try {
        parsedFields = typeof form.fields === 'string' 
          ? JSON.parse(form.fields) 
          : form.fields || [];
      } catch (error) {
        console.error('Error parsing fields:', error);
      }
   
      try {
        parsedTheme = typeof form.theme === 'string' 
          ? JSON.parse(form.theme) 
          : form.theme;
      } catch (error) {
        console.error('Error parsing theme:', error);
      }
   
      res.json({
        ...form,
        fields: parsedFields,
        theme: parsedTheme
      });
    } catch (error) {
      console.error('Error getting form:', error);
      res.status(500).json({ message: error.message });
    }
   },

   getFormsWithSubmissionStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const [forms] = await pool.execute(`
        SELECT f.*, 
          CASE WHEN fs.id IS NOT NULL THEN TRUE ELSE FALSE END as isSubmitted 
        FROM forms f 
        LEFT JOIN form_submissions fs ON f.id = fs.formId AND fs.userId = ?
        ORDER BY f.id DESC`,
        [userId]
      );
  
      const formattedForms = forms.map(form => {
        let parsedFields = [];
        let parsedTheme = null;
  
        try {
          parsedFields = typeof form.fields === 'string' 
            ? JSON.parse(form.fields) 
            : form.fields || [];
        } catch (error) {
          console.error('Error parsing fields:', error);
        }
  
        try {
          parsedTheme = typeof form.theme === 'string' 
            ? JSON.parse(form.theme) 
            : form.theme;
        } catch (error) {
          console.error('Error parsing theme:', error);
        }
  
        return {
          ...form,
          fields: parsedFields,
          theme: parsedTheme
        };
      });
  
      res.json(formattedForms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createForm: async (req, res) => {
    try {
      const { title, companyId, fields, theme } = req.body;
      
      const fieldsString = typeof fields === 'string' ? fields : JSON.stringify(fields);
      const themeString = theme ? (typeof theme === 'string' ? theme : JSON.stringify(theme)) : null;

      const [result] = await pool.execute(
        'INSERT INTO forms (title, companyId, fields, theme) VALUES (?, ?, ?, ?)',
        [title, companyId, fieldsString, themeString]
      );

      res.status(201).json({ 
        id: result.insertId, 
        title, 
        companyId, 
        fields, 
        theme 
      });
    } catch (error) {
      console.error('Error creating form:', error);
      res.status(500).json({ message: error.message });
    }
  },

  updateForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, companyId, fields, theme } = req.body;

      const fieldsString = typeof fields === 'string' ? fields : JSON.stringify(fields);
      const themeString = theme ? (typeof theme === 'string' ? theme : JSON.stringify(theme)) : null;

      await pool.execute(
        'UPDATE forms SET title = ?, companyId = ?, fields = ?, theme = ? WHERE id = ?',
        [title, companyId, fieldsString, themeString, id]
      );

      res.json({ 
        id: Number(id), 
        title, 
        companyId, 
        fields, 
        theme 
      });
    } catch (error) {
      console.error('Error updating form:', error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteForm: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM forms WHERE id = ?', [id]);
      res.json({ message: 'Form deleted successfully' });
    } catch (error) {
      console.error('Error deleting form:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = formController;