const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.post('/', authenticate, submissionController.createSubmission);
router.get('/', authenticate, submissionController.getSubmissions);
router.get('/all', authenticate, isAdmin, submissionController.getAllSubmissions);
router.get('/form/:formId', authenticate, submissionController.getSubmissionsByForm);
router.delete('/:id', authenticate, isAdmin, submissionController.deleteSubmission);

module.exports = router;