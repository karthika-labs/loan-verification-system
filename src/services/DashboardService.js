// services/DashboardService.js
import db from '../config/db.js';

export const fetchStats = async () => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM loanapplication) AS totalApplications,
            (SELECT COUNT(*) FROM loan_approval WHERE status = 'Pending') AS pending,
            (SELECT COUNT(*) FROM loan_approval WHERE status = 'Approved') AS approved,
            (SELECT COUNT(*) FROM loan_approval WHERE status = 'Rejected') AS rejected,
            (SELECT COUNT(*) FROM users) AS totalUsers
    `;

    const [rows] = await db.query(query);  // ✅ THIS is correct with mysql2/promise
    return rows[0];
};
