const mongoose = require("mongoose")
const { string } = require("zod")
mongoose.connect("mongodb+srv://admin:Sujal2712@cluster0.u8rm3ts.mongodb.net/paypal")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,   
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50

    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50

    }, 
}, {
    timestamps: true
})

const accountSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // to store INR
    // you store integer(not float) with 2 decimals to rid of precision errors
    // (eg. 23.45 => 2345)
    balance: {
        type: Number, 
        required: true,
    }
})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account
}