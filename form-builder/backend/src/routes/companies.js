const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');

router.get('/', getAllCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;
