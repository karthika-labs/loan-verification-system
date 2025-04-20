// controllers/DashboardController.js
import { fetchStats } from '../services/DashboardService.js';

export const getDashboardStats = async (req, res) => {
    try {
        const role = req.user?.role;

        if (role !== 'loan_authority' && role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Manager or Admin only' });
        }

        const stats = await fetchStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Dashboard Controller Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
