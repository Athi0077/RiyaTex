import express from 'express';
import { register, login, changeRole, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-role', changeRole);
router.get('/me', authMiddleware, getMe);

export default router;
