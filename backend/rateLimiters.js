const rateLimit = require("express-rate-limit")

// 1. GLOBAL LIMITER (For the whole app)
// Purpose: Prevent DoS attacks / server overload
// Rule: Allow 100 requests every 15 minutes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// 2. AUTH LIMITER (Strict!)
// Purpose: Prevent Password Brute Forcing
// Rule: Allow only 10 tries every 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: "Too many login attempts. Please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false, 
})

module.exports = {
    globalLimiter,
    authLimiter
}