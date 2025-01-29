const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/', authenticate, formController.getForms);
router.post('/', authenticate, isAdmin, formController.createForm);
router.put('/:id', authenticate, isAdmin, formController.updateForm);
router.delete('/:id', authenticate, isAdmin, formController.deleteForm);

module.exports = router;