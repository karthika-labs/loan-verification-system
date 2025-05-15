import db from '../config/db.js'; // Assuming db.js handles your database connection

export const storeDocument = async (documentName, documentPath) => {
  try {
    const [result] = await db.execute(`INSERT INTO loan_documents (documentName, documentPath) VALUES (?, ?)`, [documentName, documentPath]);
    return result.insertId;
  } catch (error) {
    throw new Error('Error storing document: ' + error.message);
  }
};

export const applyLoan = async (loanDetails) => {
  const {
    userid, applicantDOB, gender, annualIncome, occupation,
    loanAmount, firstName, lastName, aadharNo, panNo, tenure, address,
    mobNo, alternateMobileNo, email, emrContactName, emrContactNum,
    marital_status, pBank_Name, ifsc_code, emergency_contact_name,
    emergency_contact_num, existing_loan, collateral_details, documentID
  } = loanDetails;

  try {
    // 1. Check if user already has a pending loan
    const [pendingRows] = await db.execute(`
      SELECT a.status FROM loanapplication l
      JOIN loan_approval a ON l.loanApplicationID = a.loanApplicationID
      WHERE l.userid = ? AND a.status = 'Pending'
    `, [userid]);

    if (pendingRows.length > 0) {
      return { success: false, code: 400, message: "You already have a pending loan application."};
    }

    // 2. Check for duplicate Aadhar or PAN in existing applications
    const [duplicateRows] = await db.execute(`
      SELECT loanApplicationID FROM loanapplication
      WHERE aadharNo = ? OR panNo = ?
    `, [aadharNo, panNo]);

    if (duplicateRows.length > 0) {
      return { success: false, code: 400, message: "Loan already applied with same Aadhar or PAN number." };
    }

    // 3. Insert into loanapplication table
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

    const [loanResult] = await db.execute(insertLoanQuery, values);
    const loanApplicationID = loanResult.insertId;

    // 4. Insert into loan_approval
    await db.execute(`
      INSERT INTO loan_approval (loanApplicationID) VALUES (?)
    `, [loanApplicationID]);

    await db.execute(`UPDATE loan_documents SET loanApplicationID = ? WHERE documentID = ?`, [loanApplicationID, documentID]);

    return { success: true, code: 201, message: "Loan application submitted successfully!"};

  } catch (error) {
    throw new Error('Error applying for loan: ' + error.message);
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

const getLoansByUserID = async (userid) => {
  const query = `
    SELECT * 
    FROM loanapplication l
    JOIN loan_approval a ON l.loanApplicationID = a.loanApplicationid
    WHERE l.userid = ?
  `;
  try {
    const [rows] = await db.execute(query, [userid]);
    return rows;
  } catch (error) {
    throw new Error("Error fetching loans for user: " + error.message);
  }
};

export const getDocumentByAppID = async (loanApplicationID) => {
  try {
    const [rows] = await db.execute(`
      SELECT documentID, documentName, documentPath, uploaded_at 
      FROM loan_documents 
      WHERE loanApplicationID = ?
    `, [loanApplicationID]);

    return rows[0]; // Assuming one document per loan application
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};


export default { applyLoan, getAllLoans , getLoanById, updateApprovalStatus, getLoanApplStatusById, getLoansByUserID, storeDocument, getDocumentByAppID};
