const LoanService = require('../services/LoanService');

const applyLoan = async (req, res) => {
  try {
    const { userid, applicantName, applicantDOB, gender, annualIncome, occupation, loanAmount, firstName, lastName, aadharNo, panNo, tenure, address, mobNo, alternateMobileNo, email, emrContactName, emrContactNum } = req.body;

    // Validation: Check if all required fields are provided
    if (!userid || !applicantName || !applicantDOB || !gender || !annualIncome || !occupation || !loanAmount || !firstName || !lastName || !aadharNo || !panNo || !tenure || !address || !mobNo || !email || !emrContactName || !emrContactNum) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const response = await LoanService.applyLoan({
      userid,
      applicantName,
      applicantDOB,
      gender,
      annualIncome,
      occupation,
      loanAmount,
      firstName,
      lastName,
      aadharNo,
      panNo,
      tenure,
      address,
      mobNo,
      alternateMobileNo,
      email,
      emrContactName,
      emrContactNum
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { applyLoan };
