const express = require("express")
const { createUser, linkBvn, loginUser } = require("../controller/user.controller")
const { createTransaction, getTransactions, getMonthlyCategorySpending } = require("../controller/transaction.controller")
const { addMoney, getAccounts } = require("../controller/account.controller")
const { createBudget, getBudgets } = require("../controller/budget.controller")
const router  = express.Router()


router.post("/auth", createUser)
router.post("/login", loginUser)
router.post("/linkbvn", linkBvn)
router.post("/createTransact", createTransaction)
router.get("/transaction", getTransactions)
router.post("/addmoney/:id", addMoney)
router.get("/getaccount/:id", getAccounts)
router.post("/createBudget/:userId", createBudget)
router.get("/getbudget/:userId", getBudgets)

router.get("/getmonthlyspending",  getMonthlyCategorySpending)
module.exports = router