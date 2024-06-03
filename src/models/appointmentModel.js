const { db } = require('../config/firebaseConfig');

exports.countActiveAppointments = async () => {
    const snapshot = await db.collection('appointments').where('status', '!=', 'ended').get();
    return snapshot.size;
};

exports.createAppointment = async (appointmentData) => {
    const docRef = await db.collection('appointments').add(appointmentData);
    return { id: docRef.id, ...appointmentData };
};

exports.updateAppointmentStatus = async (appointmentId, status) => {
    await db.collection('appointments').doc(appointmentId).update({ status });
};

exports.countAppointmentsByPatientAndStatus = async (patientId, status) => {
    const snapshot = await db.collection('appointments')
        .where('patientId', '==', patientId)
        .where('status', '==', status)
        .get();
    return snapshot.size;
};

exports.checkForConflictingAppointments = async (doctorId, date, startTime, endTime) => {
    const appointments = await db.collection('appointments')
        .where('doctorId', '==', doctorId)
        .where('date', '==', date)
        .get();

    return appointments.docs.some(appointment => {
        const existingStartTime = new Date(appointment.data().time);
        const existingEndTime = new Date(appointment.data().endTime);
        return (startTime < existingEndTime && endTime > existingStartTime);
    });
};