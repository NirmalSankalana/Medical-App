const userModel = require('../models/userModel');
const appointmentModel = require('../models/appointmentModel');

exports.fetchDoctors = async ({ page, limit, name, category }) => {
    return userModel.getAllUsers({ page, limit, name, category, role: 'doctor' });
};

exports.fetchDashboardStats = async () => {
    const totalDoctors = await userModel.countUsersByRole('doctor');
    const totalPatients = await userModel.countUsersByRole('patient');
    const activeAppointments = await appointmentModel.countActiveAppointments();
    return {
        totalDoctors,
        totalPatients,
        activeAppointments
    };
};