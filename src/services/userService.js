const { admin } = require('../config/firebaseConfig');
const userModel = require('../models/userModel');

// Create a new user in Firebase Authentication and Firestore
exports.registerUser = async (userData) => {
    try {
        const userRecord = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
        });

        console.log("Firebase Auth user created, UID:", userRecord.uid);

        // Add additional user details to Firestore
        await userModel(userRecord.uid, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            dob: userData.dob,
            telephone: userData.telephone,
            role: userData.role
        });

        console.log("Firestore user data set for UID:", userRecord.uid);

        return { success: true, uid: userRecord.uid };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: error.message };
    }
};

// Authenticate user and get custom token
exports.authenticateUser = async (email, password) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const userData = await userModel.getUserById(userRecord.uid);
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        return { success: true, token: customToken, role: userData.data.role };
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { success: false, message: error.message };
    }
};
