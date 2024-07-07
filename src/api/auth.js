/**
 * @openapi
 * /auth/register/patient:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Register a new patient
 *     description: Registers a new patient with their personal information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - dob
 *               - telephone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /auth/register/doctor:
 *   post:
 *     tags:
 *       - User Authentication
 *     summary: Register a new doctor
 *     description: Registers a new doctor by an admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - dob
 *               - telephone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *       403:
 *         description: Unauthorized, admin role required
 *       500:
 *         description: Server error
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

// Patient registration
router.post('/register/patient', validateRegistration, authController.registerPatient);

// Doctor registration, admin only
router.post('/register/doctor', verifyToken, requireRole('admin'), validateRegistration, authController.registerDoctor);

// User login
router.get('/user/:id', authController.getLoginUser);

module.exports = router;