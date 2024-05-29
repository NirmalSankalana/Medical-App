const { getUserById } = require('../models/userModel');

exports.requireRole = (requiredRoles) => { // `requiredRoles` can be a single string or an array of roles
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(403).send({ message: "Authentication required" });
    }

    try {
      const userRecord = await getUserById(req.user.uid);
      if (!userRecord.success) {
        throw new Error(userRecord.message);
      }

      const userRole = userRecord.data.role;
      if (Array.isArray(requiredRoles) ? requiredRoles.includes(userRole) : userRole === requiredRoles) {
        next();
      } else {
        res.status(403).send({ message: "Insufficient permissions." });
      }
    } catch (error) {
      res.status(403).send({ message: error.message });
    }
  };
};
