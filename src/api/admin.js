const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Apply middleware globally to all routes in this router
router.use(verifyToken, requireRole('admin'));

/**
 * @openapi
 * /admin/doctors:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List all doctors with optional filters
 *     description: Retrieve a paginated list of doctors with optional search filters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number of the pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items to return per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name to filter the doctor list
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Category to filter the doctor list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       403:
 *         description: Unauthorized access, only admins are allowed
 */

router.get('/doctors', adminController.listDoctors);

/**
 * @openapi
 * /admin/dashboard-stats:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get dashboard statistics
 *     description: Provides statistics for the admin dashboard, including counts of doctors, patients, and active appointments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDoctors:
 *                   type: integer
 *                 totalPatients:
 *                   type: integer
 *                 activeAppointments:
 *                   type: integer
 *       403:
 *         description: Unauthorized access, only admins are allowed
 */

router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;