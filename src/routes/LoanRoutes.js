import express from 'express';
import LoanController from '../controllers/LoanController.js';

const router = express.Router();

// POST route to apply for a loan
router.post('/apply', LoanController.applyLoan);

export default router;
