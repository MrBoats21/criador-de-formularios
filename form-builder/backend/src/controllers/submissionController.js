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
        `SELECT fs.id, fs.formId, fs.answers, fs.submittedAt, fs.status, f.title as formTitle 
         FROM form_submissions fs
         JOIN forms f ON fs.formId = f.id
         WHERE fs.userId = ?`,
        [userId]
      );
  
      const parsedSubmissions = submissions.map(submission => ({
        ...submission,
        answers: typeof submission.answers === 'string' 
          ? JSON.parse(submission.answers)
          : submission.answers
      }));
  
      res.json(parsedSubmissions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllSubmissions: async (req, res) => {
    try {
      const [submissions] = await pool.execute(
        `SELECT fs.*, f.title as formTitle, u.name as userName 
         FROM form_submissions fs
         JOIN forms f ON fs.formId = f.id
         JOIN users u ON fs.userId = u.id
         ORDER BY fs.submittedAt DESC`
      );
  
      const parsedSubmissions = submissions.map(submission => ({
        ...submission,
        answers: typeof submission.answers === 'string' 
          ? JSON.parse(submission.answers)
          : submission.answers
      }));
  
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
  }
};

module.exports = submissionController;