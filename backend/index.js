const express = require("express");
const jwt = require("jsonwebtoken")
const cors = require("cors")
const rootRouter = require("./routes");
const { globalLimiter } = require("./rateLimiters");
const app = express();
PORT = 3000

app.use(express.json())
app.use(cors())
app.use(globalLimiter)
 
app.get("/", (req, res) => {
    console.log("Hello!")
    res.redirect("/api/v1/signin")
})

app.use("/api/v1", rootRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    return res.status(500).send({
        message: "Sorry, something went wrong!"
    })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})