const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./config")

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Missing Authorization Header"
        })
    }

    const token = authHeader.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            // Handle case where token is valid but has no ID (rare, but possible)
            return res.status(403).json({
                message: "Invalid Token Payload"
            });
        }

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or Expired Token"
        })
    }
}

module.exports = {
    authMiddleware,
}