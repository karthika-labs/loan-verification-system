import LoanService from '../services/LoanService.js';

const applyLoan = async (req, res) => {
  try {
    const {
      userid, applicantDOB, gender, annualIncome, occupation,
      loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
      mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
      marital_status, pBank_Name, ifsc_code, emergency_contact_name,
      emergency_contact_num, existing_loan, collateral_details
    } = req.body;

    // Define an array of required fields
    const requiredFields = [
      'userid', 'applicantDOB', 'gender', 'annualIncome', 'occupation',
      'loanAmount', 'firstName', 'lastName', 'aadharNo', 'panNo', 'tenure', 'address',
      'mobNo', 'email', 'emrContactName', 'emrContactNum', 'marital_status', 'pBank_Name',
      'ifsc_code', 'emergency_contact_name', 'emergency_contact_num', 'existing_loan'
    ];

    // Create an array to store missing fields
    const missingFields = requiredFields.filter(field => !req.body[field]);

    // If any required fields are missing, return a response with the missing fields
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // If validation passes, proceed with applying loan
    const response = await LoanService.applyLoan(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

export default { applyLoan, getAllLoans, getLoanById, updateLoanApproval,getLoanApplicationStatusByID,getLoansByUserID };


