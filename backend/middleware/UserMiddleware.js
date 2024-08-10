const jwt = require('jsonwebtoken');

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
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

function verifyAccountStatus(req, res, next) {
    if (req.user && req.user.account_status) {
        next();
    } else {
        return res.status(403).json({ message: 'Account not verified' });
    }
}

module.exports = { verifyToken, verifyAccountStatus };
