const express = require("express")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const { userZod, userSigninZod, userUpdateZod } = require("../types")
const { generateHash, compareHash } = require("../bcrypt")
const { JWT_SECRET } = require("../config")
const { User, Account } = require("../db")
const { authMiddleware } = require("../middleware")
const { authLimiter } = require("../rateLimiters")

userRouter.post("/signup", authLimiter, async (req, res) => {
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

        // float from 1-10000
        const randomFloat = parseFloat((Math.random() * (10000 - 1) + 1).toFixed(2));
        const balance = Math.round(randomFloat * 100); // Use Math.round() to avoid precision errors
        const giveRandomBalance = await Account.create({ userId: user._id, balance: balance })

        // to get the balance from DB
        const balanceInINR = parseFloat((giveRandomBalance.balance / 100).toFixed(2));
        console.log(balanceInINR);

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

userRouter.post("/signin", authLimiter, async (req, res) => {
    try {
        const { success, data } = userSigninZod.safeParse(req.body)

        if (!success) {
            return res.status(400).json({
                message: "Invalid Inputs"
            })
        }

        const { username, password } = data

        const user = await User.findOne({ username: username })

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

userRouter.put("/", authLimiter, authMiddleware, async (req, res) => {
    try {
        const result = userUpdateZod.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                details: result.error.issues
            });
        }

        const data = result.data;
        const updateBody = {}; // We will fill this dynamically

        if (data.firstName) {
            updateBody.firstName = data.firstName;
        }

        if (data.lastName) {
            updateBody.lastName = data.lastName;
        }

        if (data.password) {
            updateBody.password = await generateHash(data.password);
        }

        const user = await User.findOneAndUpdate(
            { _id: req.userId },
            { $set: updateBody },
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Updated Successfully"
        })

    } catch (error) {
        console.log("Update Error", error)

        return res.status(500).json({
            message: "Internal Server Error during Update"
        })
    }
})

userRouter.get("/bulk", authMiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.filter || ""

        const users = await User.find({
            $or: [
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } }
            ]
        }, {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1
        });

        return res.status(200).json({
            users: users,
        })

    } catch (error) {
        console.log("Bulk Error", error)

        return res.status(500).json({
            message: "Internal Server Error during Fetchin Users"
        })
    }
})

module.exports = { userRouter }