const { admin } = require('../config/firebaseConfig');

// Middleware to verify Firebase token (authentication)
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(403).send({ message: "No token provided." });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send({ message: "Invalid token.", error: error.message });
  }
};
