
const jwt = require('jsonwebtoken')
const { rateLimit } = require('express-rate-limit')

const { query } = require('../config/db')
// ==================== User Registration Validation ====================

const registerValidation = async (req, res, next) => {
    let { username = '', phone = '', email = '', password = '' } = req.body;
    if (!username.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        return res.status(417).send({
            success: false,
            message: 'Please fill all the required fields',
        })
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/
    if (!emailRegex.test(email)) {
        return res.status(417).send({
            success: false,
            message: "Invalid email format"
        })
    }
    if (!phoneRegex.test(phone)) {
        return res.status(406).send({
            success: false,
            message: "Please enter 10 digit number"
        })
    }
    req.body.username = username.trim();
    req.body.email = email.trim().toLowerCase();
    req.body.password = password.trim();
    next();
}

// ==================== Check Token and Decode It ====================
const authentication = (req, res, next) => {
    let token = req.headers['Authorization'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "You are not logged in, please login"
        })
    }
    token = token.split(' ')[1]; 
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Invalid JWT token or token expired"
            })
        }
        try {
            // const [user] = await query("SELECT * FROM User WHERE user_id = ?", [decoded.id]);
            // if (!user) {
            //     return res.status(404).send({
            //         status: false,
            //         message: "User not found"
            //     })
            // }
            // if (token !== user.token) {
            //     return res.status(406).send({
            //         status: false,
            //         message: "Invalid Token"
            //     })
            // }
            req.decoded = decoded;
            next();
        } catch (err) {
            return res.status(500).send({
                status: false,
                message: "Internal server error",
                error: err.message
            })
        }
    })
}

//==================================== Rate limit handler ==================================

const rateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: 3, // maximum number of request inside a window
    message: "You have exceeded the 3 requests in 24 hrs limit!", // the message when they exceed limit
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode: 429
});


module.exports = { authentication, registerValidation, rateLimiter };