const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Primeiro as rotas específicas
router.get('/with-status', authenticate, formController.getFormsWithSubmissionStatus);

// Depois as rotas com parâmetros
router.get('/:id', authenticate, formController.getForm);
router.get('/', authenticate, formController.getForms);
router.post('/', authenticate, isAdmin, formController.createForm);
router.put('/:id', authenticate, isAdmin, formController.updateForm);
router.delete('/:id', authenticate, isAdmin, formController.deleteForm);

module.exports = router;