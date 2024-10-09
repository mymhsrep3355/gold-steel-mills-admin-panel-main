const jwt = require('jsonwebtoken');
const User = require('../models/User');
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Access Denied. No Token Provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access Denied. Token Missing.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = verified.user_id;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

function verifyAccountStatus(req, res, next) {
    if (!req.user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    User.findById(req.user_id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found By Middleware' });
            }

            req.user = user; // Update the request's user with the found user data

            if (req.user.account_status) {
                next(); // User is verified, proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ message: 'Account not verified' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: 'Internal server error: ' + err.message });
        });
}

module.exports = { verifyToken, verifyAccountStatus };
