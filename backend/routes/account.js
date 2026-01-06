const express = require('express')
const mongoose = require('mongoose')
const { authMiddleware } = require('../middleware')
const { Account, Transaction } = require('../db')
const accountRouter = express.Router()

accountRouter.use(authMiddleware)

accountRouter.get("/balance", async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId })

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        // to get the balance from DB
        const balanceInINR = parseFloat((account.balance / 100).toFixed(2));
        console.log(balanceInINR);

        res.status(200).json({
            balance: balanceInINR,
        })

    } catch (error) {
        console.log("Error in Balance fetching", error)

        return res.status(500).json({
            message: "Internal Server Error during Fetching Balance"
        })
    }
})

accountRouter.post("/transfer", async(req, res) => {
    // Validate input BEFORE starting the session
    const { to, amount } = req.body;

    if (!to || !amount || amount <= 0 || !Number.isInteger(amount)) {
        return res.status(400).json({
            message: "Invalid recipient or amount (must be integer in cents)"
        });
    }

    // Prevent Self-Transfer
    if (to === req.userId) {
        return res.status(400).json({
            message: "Cannot transfer to self"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction() 

    try {        
        const sender = await Account.findOne({ userId: req.userId }).session(session)

        if (!sender) {
            await session.abortTransaction(); // Abort manually before return
            return res.status(400).json({
                message: "Sender Account not found"
            });
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const recipient = await Account.findOne({ userId: to }).session(session);

        if (!recipient) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Recipient Account not found"
            });
        }

        // Transaction
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Create Audit Trail (The Ledger) - CRITICAL STEP
        await Transaction.create([{
            senderId: req.userId,
            receiverId: to,
            amount: amount,
            timestamp: new Date()
        }], { session: session }); // Pass session to include this in the rollback protection!

        await session.commitTransaction()
        res.status(200).json({
            message: "Transfer Successful"
        })

    } catch (error) {
        await session.abortTransaction()
        console.log("Transaction failed", error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error during Transaction"
        })

    } finally {
        await session.endSession()
    }
})

module.exports = { accountRouter }