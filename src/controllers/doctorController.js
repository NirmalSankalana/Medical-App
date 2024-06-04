const doctorService = require('../services/doctorService');

exports.listAppointments = async (req, res) => {
    try {
        const appointments = await doctorService.fetchAppointments(req.user.id);
        res.status(200).json({ error: false, data: appointments });
    } catch (error) {
        console.error('Error listing appointments:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve appointments.' });
    }
};

exports.declineAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        await doctorService.declineAppointment(id);
        res.status(200).json({ error: false, data: { message: 'Appointment declined successfully.' } });
    } catch (error) {
        console.error('Error declining appointment:', error);
        res.status(500).json({ error: true, message: 'Failed to decline appointment.' });
    }
};

exports.accessMedicalRecords = async (req, res) => {
    const { patientId } = req.params;
    try {
        const records = await doctorService.fetchMedicalRecords(patientId, req.user.id);
        if (!records) {
            res.status(403).json({ error: true, message: 'Access to medical records denied.' });
        } else {
            res.status(200).json({ error: false, data: records });
        }
    } catch (error) {
        console.error('Error accessing medical records:', error);
        res.status(500).json({ error: true, message: 'Failed to retrieve medical records.' });
    }
};