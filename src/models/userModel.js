const { db } = require('../config/firebaseConfig');

const userCollection = db.collection('users');

// Function to create a new user in Firestore
const createUser = async (userId, userData) => {
    try {
        await userCollection.doc(userId).set(userData);
        return { success: true, message: 'User created successfully', userId: userId };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: error.message };
    }
};

// Function to retrieve a user from Firestore
const getUserById = async (userId) => {
    try {
        const doc = await userCollection.doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        }
        return { success: false, message: 'User not found' };
    } catch (error) {
        console.error('Error getting user:', error);
        return { success: false, message: error.message };
    }
};

module.exports = {
    createUser,
    getUserById
};
