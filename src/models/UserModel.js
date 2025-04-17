const db = require('../config/db');

class User {
  static async createUser(username, mailID, role, password, phoneno) {
    const query = `INSERT INTO users (username, mailID, role, password, phoneno) VALUES (?, ?, ?, ?, ?)`;
    return db.execute(query, [username, mailID, role, password, phoneno]);
  }

  static async findUserByEmail(mailID) {
    const query = `SELECT * FROM users WHERE mailID = ?`;
    const [rows] = await db.execute(query, [mailID]);
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = User;
