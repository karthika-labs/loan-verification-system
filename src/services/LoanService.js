import db from '../config/db.js'; // Assuming db.js handles your database connection

const applyLoan = async (loanDetails) => {
  const {
    userid, applicantDOB, gender, annualIncome, occupation,
    loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
    mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
    marital_status, pBank_Name, ifsc_code, emergency_contact_name,
    emergency_contact_num, existing_loan, collateral_details
  } = loanDetails;

  const insertLoanQuery = `
    INSERT INTO loanapplication (
      userid, applicantDOB, gender, annualIncome, occupation,
      loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
      mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
      marital_status, pBank_Name, ifsc_code, emergency_contact_name,
      emergency_contact_num, existing_loan, collateral_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userid, applicantDOB, gender, annualIncome, occupation,
    loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
    mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
    marital_status, pBank_Name, ifsc_code, emergency_contact_name,
    emergency_contact_num, existing_loan, collateral_details
  ];

  try {
    // Insert into loanapplication
    const [loanResult] = await db.execute(insertLoanQuery, values);
    const loanApplicationID = loanResult.insertId;

    // Insert into loan_approval table
    const insertApprovalQuery = `INSERT INTO loan_approval (loanApplicationID) VALUES (?)`;
    await db.execute(insertApprovalQuery, [loanApplicationID]);

    return {
      message: "Loan application submitted successfully",
      loanApplicationID
    };
  } catch (error) {
    throw new Error("Error applying for loan: " + error.message);
  }
};

export default { applyLoan };
