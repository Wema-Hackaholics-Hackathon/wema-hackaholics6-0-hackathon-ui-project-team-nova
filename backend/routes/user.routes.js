const express = require("express")
const { createUser, linkBvn, loginUser } = require("../controller/user.controller")
const { createTransaction, getTransactions } = require("../controller/transaction.controller")
const router  = express.Router()


router.post("/auth", createUser)
router.post("/login", loginUser)
router.post("/linkbvn", linkBvn)
router.post("/createTransact", createTransaction)
router.get("/transaction", getTransactions)
module.exports = router