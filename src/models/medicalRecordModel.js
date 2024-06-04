const { storage } = require('../config/firebaseConfig'); // Ensure you have a Firebase Storage instance configured

exports.storeMedicalRecord = async (patientId, file) => {
    const filePath = `medicalRecords/${patientId}/${file.originalname}`;
    const fileRef = storage.bucket().file(filePath);
    await fileRef.save(file.buffer);
    return await fileRef.getSignedUrl({ action: 'read', expires: '03-09-2491' });
};

exports.listMedicalRecords = async (patientId) => {
    const fileList = [];
    const files = await storage.bucket().getFiles({ prefix: `medicalRecords/${patientId}/` });
    files.forEach(file => {
        fileList.push({
            name: file.name,
            size: file.metadata.size,
            contentType: file.metadata.contentType,
            updateTime: file.metadata.updated
        });
    });
    return fileList;
};

exports.getMedicalRecord = async (patientId, filename) => {
    const file = storage.bucket().file(`medicalRecords/${patientId}/${filename}`);
    return file.createReadStream();
};

exports.checkDoctorPermission = async (patientId, doctorId) => {
    const permissions = await db.collection('permissions')
        .where('patientId', '==', patientId)
        .where('doctorId', '==', doctorId)
        .get();
    return !permissions.empty;
};

exports.getMedicalRecord = async (patientId, filename, doctorId) => {
    const hasPermission = await this.checkDoctorPermission(patientId, doctorId);
    if (!hasPermission) return null;

    const file = storage.bucket().file(`medicalRecords/${patientId}/${filename}`);
    return file.createReadStream();
};