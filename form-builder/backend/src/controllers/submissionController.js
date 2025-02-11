const pool = require('../config/database');

const submissionController = {
  createSubmission: async (req, res) => {
    try {
      const userId = req.user.id;
      const { formId, answers } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO form_submissions (formId, userId, answers) VALUES (?, ?, ?)',
        [formId, userId, JSON.stringify(answers)]
      );
      res.status(201).json({ id: result.insertId, formId, userId, answers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSubmissions: async (req, res) => {
    try {
      const userId = req.user.id;
      const [submissions] = await pool.execute(
        `SELECT fs.id, fs.formId, fs.answers, fs.submittedAt, fs.status, f.title as formTitle,
                f.fields as formFields 
         FROM form_submissions fs
         JOIN forms f ON fs.formId = f.id
         WHERE fs.userId = ?`,
        [userId]
      );
  
      const parsedSubmissions = submissions.map(submission => {
        let formFields = [];
        let answers = {};
        
        try {
          formFields = typeof submission.formFields === 'string' 
            ? JSON.parse(submission.formFields)
            : submission.formFields || [];
            
          answers = typeof submission.answers === 'string'
            ? JSON.parse(submission.answers)
            : submission.answers || {};
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
  
        // Adiciona o tipo do campo em cada resposta
        const answersWithType = Object.entries(answers).reduce((acc, [key, answer]) => {
          const field = formFields.find(f => f.id === key);
          return {
            ...acc,
            [key]: {
              ...answer,
              type: field?.type || 'text'
            }
          };
        }, {});
  
        return {
          ...submission,
          formFields: undefined, // Remove do resultado final
          answers: answersWithType
        };
      });
  
      res.json(parsedSubmissions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllSubmissions: async (req, res) => {
    try {
      const [submissions] = await pool.execute(
        `SELECT 
          fs.*,
          f.title as formTitle,
          f.fields as formFields,
          f.companyId,
          u.name as userName,
          c.name as companyName
         FROM form_submissions fs
         JOIN forms f ON fs.formId = f.id
         JOIN users u ON fs.userId = u.id
         JOIN companies c ON f.companyId = c.id
         ORDER BY fs.submittedAt DESC`
      );
  
      const parsedSubmissions = submissions.map(submission => {
        let formFields = [];
        let answers = {};
        
        try {
          formFields = typeof submission.formFields === 'string' 
            ? JSON.parse(submission.formFields)
            : submission.formFields || [];
            
          answers = typeof submission.answers === 'string'
            ? JSON.parse(submission.answers)
            : submission.answers || {};
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
  
        // Adiciona o tipo do campo em cada resposta
        const answersWithType = Object.entries(answers).reduce((acc, [key, answer]) => {
          const field = formFields.find(f => f.id === key);
          return {
            ...acc,
            [key]: {
              ...answer,
              type: field?.type || 'text'
            }
          };
        }, {});
  
        return {
          ...submission,
          formFields: undefined,
          answers: answersWithType,
          submittedAt: new Date(submission.submittedAt).toISOString(),
          status: submission.status || 'pending'
        };
      });
  
      res.json(parsedSubmissions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getSubmissionsByForm: async (req, res) => {
    try {
      const { formId } = req.params;
      const [submissions] = await pool.execute(
        'SELECT * FROM form_submissions WHERE formId = ?',
        [formId]
      );
      res.json(submissions.map(submission => ({
        ...submission,
        answers: JSON.parse(submission.answers)
      })));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteSubmission: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM form_submissions WHERE id = ?', [id]);
      res.json({ message: 'Submissão deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = submissionController;