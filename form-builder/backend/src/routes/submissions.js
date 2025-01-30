const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, submissionController.createSubmission);
router.get('/', authenticate, submissionController.getSubmissions);
router.get('/form/:formId', authenticate, submissionController.getSubmissionsByForm);

module.exports = router;