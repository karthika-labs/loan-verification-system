// routes/DashboardRoutes.js
import express from 'express';
import { getDashboardStats } from '../controllers/DashboardController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = express.Router();

router.get('/dashboard/stats',authenticateToken, authorizeRoles('admin', 'loan_authority'), getDashboardStats);

export default router;
