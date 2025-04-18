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

const getAllLoans = async () => {
  const query = `
    SELECT 
      l.*, a.loanApprovalid, a.status AS approvalStatus, a.remark 
    FROM 
      loanapplication l 
    JOIN 
      loan_approval a 
    ON 
      l.loanApplicationID = a.loanApplicationID
  `;

  try {
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    throw new Error("Error fetching loan applications: " + error.message);
  }
};

const getLoanById = async (id) => {
  const query = `
    SELECT l.*, a.status, a.remark
    FROM loanapplication l
    JOIN loan_approval a ON l.loanApplicationID = a.loanApplicationid
    WHERE l.loanApplicationID = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows.length ? rows[0] : null;
};




const updateApprovalStatus = async (loanApplicationID, status, remark = null) => {
  const query = `
    UPDATE loan_approval
    SET status = ?, remark = ?
    WHERE loanApplicationid = ?
  `;

  try {
    const [result] = await db.execute(query, [status, remark, loanApplicationID]);

    if (result.affectedRows === 0) {
      throw new Error("Loan approval record not found for the provided loan ID.");
    }

    return { loanApplicationID, status, remark };
  } catch (error) {
    throw new Error("Error updating loan approval: " + error.message);
  }
};

const getLoanApplStatusById = async (id) => {
  const query = `
    SELECT *
    FROM loan_approval l
    WHERE l.loanApplicationID = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows.length ? rows[0] : null;
};


export default { applyLoan, getAllLoans , getLoanById, updateApprovalStatus, getLoanApplStatusById};
