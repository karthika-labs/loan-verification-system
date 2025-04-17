import db from '../config/db.js';

const createUser = async (username, mailID, role, password, phoneno) => {
  const query = `INSERT INTO users (username, mailID, role, password, phoneno) VALUES (?, ?, ?, ?, ?)`;
  return db.execute(query, [username, mailID, role, password, phoneno]);
};

const findUserByEmail = async (mailID) => {
  const query = `SELECT * FROM users WHERE mailID = ?`;
  const [rows] = await db.execute(query, [mailID]);
  
  // Log the rows to check if data is returned correctly
  console.log("Rows fetched from DB:", rows);
  
  return rows.length > 0 ? rows[0] : null;
};
  

// Named exports
const User = { createUser, findUserByEmail };
export default User;