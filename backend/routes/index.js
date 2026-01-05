const express = require("express")
const userRouter = require("./user")
const { authLimiter } = require("../rateLimiters")
const rootRouter = express.Router()

rootRouter.use("/user", authLimiter, userRouter)

rootRouter.get("/update", (req, res) => {
    res.send("/update")
})

module.exports = rootRouter