const pool = require('../config/database');

const submissionController = {
  createSubmission: async (req, res) => {
    try {
      const { formId, userId, answers } = req.body;
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
      const [submissions] = await pool.execute('SELECT * FROM form_submissions');
      res.json(submissions.map(submission => ({
        ...submission,
        answers: JSON.parse(submission.answers)
      })));
    } catch (error) {
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