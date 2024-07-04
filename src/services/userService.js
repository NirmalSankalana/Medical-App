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

        // Prepare user data for Firestore, removing undefined values
        const firestoreData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            dob: userData.dob,
            telephone: userData.telephone,
            role: userData.role,
            category: userData.category
        };

        if (userData.role === 'patient'){
            delete firestoreData['category'];
        }

        // Filter out undefined fields
        Object.keys(firestoreData).forEach(key => {
            if (firestoreData[key] === undefined) {
                delete firestoreData[key];
            }
        });

        // Add additional user details to Firestore
        await userModel.createUser(userRecord.uid, firestoreData);

        console.log("Firestore user data set for UID:", userRecord.uid);

        return { error: false, uid: userRecord.uid };
    } catch (error) {
        console.error('Error registering user:', error);
        return { error: true, message: error.message };
    }
};

// Authenticate user and get custom token
exports.authenticateUser = async (email, password) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const userData = await userModel.getUserById(userRecord.uid);
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        return { error: false, token: customToken, role: userData.data.role };
    } catch (error) {
        console.error('Error authenticating user:', error);
        return { error: true, message: error.message };
    }
};
