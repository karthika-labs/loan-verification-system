import express from 'express';
import LoanController from '../controllers/LoanController.js';

const router = express.Router();

// POST route to apply for a loan
router.post('/apply', LoanController.applyLoan);
router.get('/',LoanController.getAllLoans);
router.get('/:id',LoanController.getLoanById);



// PATCH route for updating approval status
router.patch('/:id/approval', LoanController.updateLoanApproval);
router.get('/:id/status',LoanController.getLoanApplicationStatusByID);

export default router;
