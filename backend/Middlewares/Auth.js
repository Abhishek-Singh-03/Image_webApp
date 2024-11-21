const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is required' });
    }

    // Extract the token by removing "Bearer " prefix
    const token = auth.split(' ')[1];

    try {
        // Attempt to verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("req.user: ", req.user); // Logs the decoded user information
        next();
    } catch (err) {
        console.error("JWT Verification Error: ", err); // Log the specific error
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is wrong or expired' });
    }
}

module.exports = ensureAuthenticated;
