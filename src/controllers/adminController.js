const adminService = require('../services/adminService');

exports.listDoctors = async (req, res) => {
    const { page = 1, limit = 10, name, category } = req.query;
    try {
        const { doctors, total } = await adminService.fetchDoctors({ page, limit, name, category });
        res.status(200).json({
            error: false,
            data: {
                doctors: doctors,
                total: total,
                page: page,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to retrieve doctors:', error);
        res.status(500).json({
            error: true,
            message: 'Error retrieving doctors list.'
        });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.fetchDashboardStats();
        res.status(200).json({
            error: false,
            data: stats
        });
    } catch (error) {
        console.error('Failed to retrieve dashboard stats:', error);
        res.status(500).json({
            error: true,
            message: 'Error retrieving statistics.'
        });
    }
};