const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, submissionController.getSubmissions);
router.post('/', authenticate, submissionController.createSubmission);

module.exports = router;