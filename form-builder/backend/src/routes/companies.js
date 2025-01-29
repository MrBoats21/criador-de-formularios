const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/', authenticate, companyController.getCompanies);
router.post('/', authenticate, isAdmin, companyController.createCompany);
router.put('/:id', authenticate, isAdmin, companyController.updateCompany);
router.delete('/:id', authenticate, isAdmin, companyController.deleteCompany);

module.exports = router;