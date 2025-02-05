import express from 'express';
import { createUser } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticate, isAdmin, createUser);

export default router;