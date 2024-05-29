const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  databaseURL: process.env.FIREBASE_DATABASE_URL  // This is needed only if using Firebase Realtime Database
});

const db = admin.firestore();

module.exports = { admin, db };