const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware.authenticate, submissionController.createSubmission);
router.get('/', authMiddleware.authenticate, submissionController.getSubmissions);
router.get('/all', authMiddleware.authenticate, authMiddleware.isAdmin, submissionController.getAllSubmissions);
router.get('/form/:formId', authMiddleware.authenticate, submissionController.getSubmissionsByForm);

module.exports = router;