import LoanService from '../services/LoanService.js';

import { promises as fs } from 'fs'; // ✅ for async file reading
import md5 from 'md5';               // ✅ if still using for some parts
import { createHash } from 'crypto'; // ✅ for Node's built-in hashing
import crypto from 'crypto';






const applyLoan = async (req, res) => {
  try {
    const {
      userid, applicantDOB, gender, annualIncome, occupation,
      loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
      mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
      marital_status, pBank_Name, ifsc_code, emergency_contact_name,
      emergency_contact_num, existing_loan, collateral_details, documentID // Correct naming
    } = req.body;

    // Define an array of required fields
    const requiredFields = [
      'userid', 'applicantDOB', 'gender', 'annualIncome', 'occupation',
      'loanAmount', 'firstName', 'lastName', 'aadharNo', 'panNo', 'tenure', 'address',
      'mobNo', 'email', 'emrContactName', 'emrContactNum', 'marital_status', 'pBank_Name',
      'ifsc_code', 'emergency_contact_name', 'emergency_contact_num', 'existing_loan', 'documentID' // Ensure all fields are validated
    ];

    // Create an array to store missing fields
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // If validation passes, proceed with applying loan
    const response = await LoanService.applyLoan({ ...req.body, documentID }); // Ensure documentID is passed
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    const documentName = req.file.originalname;
    const documentPath = req.file.path;
    // Calculate MD5 hash of the document
    const fileBuffer = await fs.readFile(documentPath);
    const fileHash = md5(fileBuffer);

    const documentID = await LoanService.storeDocument(documentName, documentPath, fileHash);
    res.status(201).json({ documentID });
  } catch (error) {
    res.status(500).json({ error: "Error uploading document: " + error.message });
  }
};

const verifyDocumentAuthenticity = async (req, res) => {
  try {
    const { loanApplicationID } = req.params;

    const documentDetails = await LoanService.getDocumentByAppID(loanApplicationID);
    if (!documentDetails) {
      return res.status(404).json({ error: "Document not found." });
    }

    const { documentPath, documentID } = documentDetails;
    const fileBuffer = await fs.readFile(documentPath);
    const currentHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

    // Check if this hash is used by a different user
    const usedByAnother = await LoanService.isDocumentUsedByOtherUser(loanApplicationID, currentHash);

    const verificationStatus = usedByAnother
      ? "Document mismatch or forged"
      : "Document is Authentic";
    if(usedByAnother){
      return res.status(409).json({
      loanApplicationID,
      documentID,
      verificationStatus
    });
    }
    else{
      return res.status(200).json({
      loanApplicationID,
      documentID,
      verificationStatus
    });
    }
    
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Error verifying document: " + error.message });
  }
};



const getAllLoans = async (req, res) => {
  try {
    const loans = await LoanService.getAllLoans();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await LoanService.getLoanById(id);
    if (!loan) {
      return res.status(404).json({ error: "Loan application not found" });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLoanApproval = async (req, res) => {
  try {
    const loanID = req.params.id;
    const { status, remark } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Approval status is required" });
    }

    const result = await LoanService.updateApprovalStatus(loanID, status, remark);
    res.status(200).json({ message: "Loan approval updated successfully", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLoanApplicationStatusByID = async(req , res) =>{
  const { id } = req.params;
  try {
    const loan_approval = await LoanService.getLoanApplStatusById(id);
    if (!loan_approval) {
      return res.status(404).json({ error: "Loan application status not found" });
    }
    res.status(200).json(loan_approval);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getLoansByUserID = async (req, res) => {
  const { userid } = req.params;  // Get userID from the request params
  
  try {
    // Fetch loans for the user
    const loans = await LoanService.getLoansByUserID(userid);
    
    if (!loans || loans.length === 0) {
      return res.status(404).json({ error: "No loan applications found for this user." });
    }

    res.status(200).json(loans);  // Return the list of loans
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocumentByLoanApplicationID = async (req, res) => {
  try {
    const { loanApplicationID } = req.params; // Extract loan application ID from params
    const document = await LoanService.getDocumentByAppID(loanApplicationID);

    if (!document) {
      return res.status(404).json({ error: 'Document not found for the provided Loan Application ID' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: `Error fetching document: ${error.message}` });
  }
};


export default { applyLoan, getAllLoans, getLoanById, updateLoanApproval,getLoanApplicationStatusByID,getLoansByUserID, uploadDocument, getDocumentByLoanApplicationID, verifyDocumentAuthenticity };


