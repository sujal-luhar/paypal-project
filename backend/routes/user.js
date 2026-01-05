const express = require("express")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const { userZod } = require("../types")
const { generateHash, compareHash } = require("../bcrypt")
const { JWT_SECRET } = require("../config")
const User = require("../db")

userRouter.post("/signup", async (req, res) => {
    try {
        const parsedUser = userZod.safeParse(req.body)

        if (!parsedUser.success) {
            return res.status(400).json({
                message: "Validation failed",
                details: parsedUser.error.issues
            });
        }

        const validatedUser = parsedUser.data

        validatedUser.password = await generateHash(validatedUser.password)
        
        const user = await User.create(validatedUser)

        const token = jwt.sign(
            { userId: user._id }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: "User created successfully",
            token: token
        })

    } catch (error) {

        if (error.code === 11000) { // MongoDB Duplicate Key Error Code
            return res.status(409).json({ // 409 Conflict
                message: "User already exists. Please sign in."
            });
        }

        // Use a real logger in production (e.g., winston or pino)
        console.error("Signup Error:", error);

        return res.status(500).json({
            message: "Internal Server Error during signup."
        });
    }
})

userRouter.post("/signin", (req, res) => {
    res.send("/signin")
})

module.exports = userRouter