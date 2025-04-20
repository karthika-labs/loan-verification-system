import express from 'express';
import LoanController from '../controllers/LoanController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';


const router = express.Router();

// AllowedRole="applicant"
router.post('/apply', authenticateToken, authorizeRoles('applicant'), LoanController.applyLoan);

// AllowedRole="admin,loan_authority"
router.get('/', authenticateToken, authorizeRoles('admin', 'loan_authority'), LoanController.getAllLoans);

// AllowedRole="admin,loan_authority"
router.get('/:id', authenticateToken, authorizeRoles('admin', 'loan_authority'), LoanController.getLoanById);

// AllowedRole="applicant"
router.get('/user/:userid', authenticateToken, authorizeRoles('applicant'), LoanController.getLoansByUserID);

// AllowedRole="loan_authority"
router.patch('/:id/approval', authenticateToken, authorizeRoles('loan_authority'), LoanController.updateLoanApproval);

// AllowedRole="loan_authority,admin"
router.get('/:id/status', authenticateToken, authorizeRoles('loan_authority', 'admin'), LoanController.getLoanApplicationStatusByID);

export default router;
