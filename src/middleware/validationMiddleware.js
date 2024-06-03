exports.validateRegistration = (req, res, next) => {
    const { email, password, firstName, lastName, dob, telephone } = req.body;
    if (!email || !password || !firstName || !lastName || !dob || !telephone) {
        return res.status(400).send({ error: true, message: "All fields are required." });
    }
    // Additional validations can be added here (e.g., regex for email and telephone)
    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: true, message: "Email and password are required." });
    }
    next();
};
