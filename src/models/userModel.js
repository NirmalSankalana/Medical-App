const { db } = require('../config/firebaseConfig');

const userCollection = db.collection('users');

// Function to create a new user in Firestore
exports.createUser = async (userId, userData) => {
    try {
        await userCollection.doc(userId).set(userData);
        return { success: true, message: 'User created successfully', userId: userId };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: error.message };
    }
};

// Function to retrieve a user from Firestore
exports.getUserById = async (userId) => {
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

exports.getAllUsers = async ({ page, limit, name, category, role }) => {
    let query = db.collection('users').where('role', '==', role);

    if (name) query = query.where('name', '==', name);
    if (category) query = query.where('category', '==', category);

    const offset = (page - 1) * limit;
    const snapshot = await query.offset(offset).limit(limit).get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const total = (await query.get()).size;

    return { users, total };
};

exports.countUsersByRole = async (role) => {
    const snapshot = await db.collection('users').where('role', '==', role).get();
    return snapshot.size;
};

exports.getUsersByRole = async (role) => {
    const snapshot = await db.collection('users').where('role', '==', role).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.updateUser = async (userId, profileData) => {
    await db.collection('users').doc(userId).update(profileData);
};