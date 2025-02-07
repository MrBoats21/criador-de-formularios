const pool = require('../config/database');

const formController = {
 getForms: async (req, res) => {
   try {
     const userId = req.user.id;
     const isAdmin = req.user.role === 'admin';
     
     if (isAdmin) {
       const [forms] = await pool.execute('SELECT * FROM forms');
       const formattedForms = forms.map(form => {
         try {
           const fields = typeof form.fields === 'string' 
             ? JSON.parse(form.fields) 
             : (Array.isArray(form.fields) ? form.fields : []);

           const theme = typeof form.theme === 'string'
             ? JSON.parse(form.theme)
             : (form.theme || null);

           return {
             ...form,
             fields,
             theme
           };
         } catch (error) {
           return {
             ...form,
             fields: [],
             theme: null
           };
         }
       });
       return res.json(formattedForms);
     }

     const [userCompany] = await pool.execute(
       `SELECT c.id FROM companies c
        JOIN company_users cu ON c.id = cu.company_id
        WHERE cu.user_id = ?`,
       [userId]
     );

     if (userCompany.length === 0) {
       return res.json([]);
     }

     const [forms] = await pool.execute(
       'SELECT * FROM forms WHERE companyId = ?',
       [userCompany[0].id]
     );

     const formattedForms = forms.map(form => {
       try {
         const fields = typeof form.fields === 'string' 
           ? JSON.parse(form.fields) 
           : (Array.isArray(form.fields) ? form.fields : []);

         const theme = typeof form.theme === 'string'
           ? JSON.parse(form.theme)
           : (form.theme || null);

         return {
           ...form,
           fields,
           theme
         };
       } catch (error) {
         return {
           ...form,
           fields: [],
           theme: null
         };
       }
     });

     res.json(formattedForms);
   } catch (error) {
     console.error('Error getting forms:', error);
     res.status(500).json({ message: error.message });
   }
 },

 getFormsWithSubmissionStatus: async (req, res) => {
   try {
     const userId = req.user.id;
     const isAdmin = req.user.role === 'admin';

     let query = `
       SELECT f.*, 
         CASE WHEN fs.id IS NOT NULL THEN TRUE ELSE FALSE END as isSubmitted 
       FROM forms f 
       LEFT JOIN form_submissions fs ON f.id = fs.formId AND fs.userId = ?
     `;

     if (!isAdmin) {
       const [userCompany] = await pool.execute(
         `SELECT c.id FROM companies c
          JOIN company_users cu ON c.id = cu.company_id
          WHERE cu.user_id = ?`,
         [userId]
       );

       if (userCompany.length === 0) return res.json([]);
       query += ` WHERE f.companyId = ${userCompany[0].id}`;
     }

     query += ' ORDER BY f.id DESC';
     const [forms] = await pool.execute(query, [userId]);

     const formattedForms = forms.map(form => {
       try {
         const fields = typeof form.fields === 'string' 
           ? JSON.parse(form.fields) 
           : (Array.isArray(form.fields) ? form.fields : []);

         const theme = typeof form.theme === 'string'
           ? JSON.parse(form.theme)
           : (form.theme || null);

         return {
           ...form,
           fields,
           theme
         };
       } catch (error) {
         return {
           ...form,
           fields: [],
           theme: null
         };
       }
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
     const isAdmin = req.user.role === 'admin';

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

     let formQuery = 'SELECT * FROM forms WHERE id = ?';
     const queryParams = [id];

     if (!isAdmin) {
       const [userCompany] = await pool.execute(
         `SELECT c.id FROM companies c
          JOIN company_users cu ON c.id = cu.company_id
          WHERE cu.user_id = ?`,
         [userId]
       );

       if (userCompany.length === 0) {
         return res.status(404).json({ message: 'Formulário não encontrado' });
       }

       formQuery += ' AND companyId = ?';
       queryParams.push(userCompany[0].id);
     }

     const [forms] = await pool.execute(formQuery, queryParams);
     
     if (forms.length === 0) {
       return res.status(404).json({ message: 'Formulário não encontrado' });
     }

     const form = forms[0];
     try {
       const fields = typeof form.fields === 'string' 
         ? JSON.parse(form.fields) 
         : (Array.isArray(form.fields) ? form.fields : []);

       const theme = typeof form.theme === 'string'
         ? JSON.parse(form.theme)
         : (form.theme || null);

       return res.json({
         ...form,
         fields,
         theme
       });
     } catch (error) {
       return res.json({
         ...form,
         fields: [],
         theme: null
       });
     }
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