const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.get('/', formController.getAllForms);
router.get('/company/:companyId', formController.getFormsByCompany);
router.post('/', formController.createForm);
router.put('/:id', formController.updateForm);
router.delete('/:id', formController.deleteForm);

module.exports = router;