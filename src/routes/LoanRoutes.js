import express from 'express';
import LoanController from '../controllers/LoanController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

import multer from 'multer';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Preserve original file extension
    const originalExtension = file.mimetype.split('/').pop();
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept PDFs only
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});


const router = express.Router();

// AllowedRole="applicant"
router.post('/apply', authenticateToken, authorizeRoles('applicant'), LoanController.applyLoan);

// Upload document route
router.post('/uploadDocument', authenticateToken, authorizeRoles('applicant'),
  (req, res, next) => {
    upload.single('document')(req, res, function(err) {
      if (err) {
        return res.status(400).json({ error: "File upload failed: " + err.message });
      }
      next();
    });
  },
  LoanController.uploadDocument
);

router.get('/:loanApplicationID/document/verify', authenticateToken, LoanController.verifyDocumentAuthenticity);


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

router.get('/:loanApplicationID/document', authenticateToken, LoanController.getDocumentByLoanApplicationID);

export default router;
