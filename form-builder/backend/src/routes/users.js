const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.post('/', authenticate, isAdmin, userController.createUser);
router.get('/company/:companyId', authenticate, isAdmin, userController.getUsersByCompany);
router.post('/reset-password', userController.resetPassword); // Nova rota para solicitar reset
router.post('/update-password', userController.updatePassword); // Nova rota para atualizar senha
router.delete('/:userId/company/:companyId', authenticate, isAdmin, userController.deleteUserFromCompany);

module.exports = router;