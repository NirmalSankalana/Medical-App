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
        // Sign in the user with email and password
        const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
        const userRecord = userCredential.user;

        // Get additional user data from your own database, if necessary
        const userData = await userModel.getUserById(userRecord.uid);
        
        // Return the relevant user data
        return {
            error: false,
            role: userData.data.role,
            id: userRecord.uid,
            email: userData.data.email,
            firstName: userData.data.firstName
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        // Handling specific errors
        if (error.code === 'auth/user-not-found') {
            return { error: true, message: "No user found with this email address." };
        } else if (error.code === 'auth/wrong-password') {
            return { error: true, message: "The password is incorrect." };
        } else if (error.code === 'auth/invalid-email') {
            return { error: true, message: "The email address is badly formatted." };
        }

        // General error
        return { error: true, message: "Authentication failed." };
    }
};
