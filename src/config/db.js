import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "loandb",
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

// Export the pool as the default export
export default pool.promise();
