const mysql = require('mysql2');
require('dotenv').config(); // Load .env variables

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "laondb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
    connection.release();
  }
});

module.exports = pool.promise();
