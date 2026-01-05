const express = require("express")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const { userZod, userSigninZod } = require("../types")
const { generateHash, compareHash, compareHash } = require("../bcrypt")
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

userRouter.post("/signin", async (req, res) => {
    try {
        const user = userSigninZod.safeParse(req.body)

        if (!user.success) {
            return res.status(400).json({
                message: "Invalid Inputs"
            })
        }

        const { username, password } = user.data

        const userExist = await User.findOne({username : username})

        if (!userExist) {
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }

        const passwordIsValid = await compareHash(password, userExist.password)

        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Invalid username or password"
            })
        }
        
        const token = jwt.sign(
            { userId: userExist._id }, 
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