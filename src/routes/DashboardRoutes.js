// routes/DashboardRoutes.js
import express from 'express';
import { getDashboardStats } from '../controllers/DashboardController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

router.get('/dashboard/stats', authenticateToken, getDashboardStats);

export default router;
