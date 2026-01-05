const express = require("express")
const userRouter = require("./user")
const rootRouter = express.Router()

rootRouter.use("/user", userRouter)

rootRouter.get("/update", (req, res) => {
    res.send("/update")
})

module.exports = rootRouter