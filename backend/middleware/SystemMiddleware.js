function requestLogger(req, res, next) {
    const method = req.method; // Get the HTTP method (GET, POST, etc.)
    const url = req.originalUrl; // Get the requested URL
    const timestamp = new Date().toISOString(); // Get the current timestamp

    console.log(`[${timestamp}] ${method} request to ${url}`);

    next(); // Pass control to the next middleware or route handler
}

module.exports = requestLogger;