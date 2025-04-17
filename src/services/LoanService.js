const pool = require('../config/db'); // Database connection

const applyLoan = async (loanDetails) => {
  const { userid, applicantName, applicantDOB, gender, annualIncome, occupation, loanAmount, firstName, lastName, aadharNo, panNo, tenure, address, mobNo, alternateMobileNo, email, emrContactName, emrContactNum } = loanDetails;

  try {
    // SQL query to insert the loan application into the loanapplication table
    const [result] = await pool.execute(
      `INSERT INTO loanapplication (userid, applicantName, applicantDOB, gender, annualIncome, occupation, applicationstatus, loanAmount, firstName, lastName, aadharNo, panNo, tenure, address, mobNo, alternateMobileNo, email, emrContactName, emrContactNum)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userid, applicantName, applicantDOB, gender, annualIncome, occupation, loanAmount, firstName, lastName, aadharNo, panNo, tenure, address, mobNo, alternateMobileNo, email, emrContactName, emrContactNum]
    );

    return { message: "Loan application submitted successfully", loanApplicationID: result.insertId };
  } catch (error) {
    throw new Error('Error applying for loan: ' + error.message);
  }
};

module.exports = { applyLoan };
