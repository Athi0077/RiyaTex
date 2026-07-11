import express from 'express';
import { getStats } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin/stats', authMiddleware, adminMiddleware, getStats);

export default router;
