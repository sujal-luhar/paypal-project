const express = require("express")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const { userZod, userSigninZod } = require("../types")
const { generateHash, compareHash } = require("../bcrypt")
const { JWT_SECRET } = require("../config")
const User = require("../db")
const { useEffect } = require("react")

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
            { userId: _id }, 
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

userRouter.post("/signin", async (req, res) => {
    try {
        const {success, data} = userSigninZod.safeParse(req.body)

        if (!success) {
            return res.status(400).json({
                message: "Invalid Inputs"
            })
        }

        const { username, password } = data

        const user = await User.findOne({username : username})

        // If user is not found, we use a dummy hash just to waste time
        // so the request takes the same amount of time as a valid user.
        const storedHash = user ? user.password : "$2b$10$abcdefghijklmnopqrstuv" // A fake valid bcrypt hash

        const passwordIsValid = await compareHash(password, storedHash)

        if (!user || !passwordIsValid) {
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }
        
        const token = jwt.sign(
            { userId: user._id }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: "Login successful",
            token: token
        })

    } catch (error) {

        console.error("Signin Error", error)

        return res.status(500).json({
            message: "Internal Server Error during signin"
        })
    }
})

module.exports = userRouter