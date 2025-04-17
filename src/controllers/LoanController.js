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

export default { applyLoan };


