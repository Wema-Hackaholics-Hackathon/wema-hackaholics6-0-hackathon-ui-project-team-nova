const express = require("express")
const { createUser, linkBvn, loginUser } = require("../controller/user.controller")
const { createTransaction, getTransactions, getCurrentMonthCategorySpending } = require("../controller/transaction.controller")
const { addMoney} = require("../controller/account.controller")
const { createBudget, getBudgets } = require("../controller/budget.controller")
const { createMultipleLoans } = require("../controller/loan.controller")
const spendMoney = require("../controller/expense.controller")
const router  = express.Router()


router.post("/auth", createUser)
router.post("/login", loginUser)
router.post("/linkbvn", linkBvn)
router.post("/createTransact", createTransaction)
router.get("/transaction", getTransactions)
router.post("/addmoney/:id", addMoney)
router.post("/createBudget/:userId", createBudget)
router.get("/getbudget/:userId", getBudgets)
router.post("/createloans", createMultipleLoans)
router.get("/getmonthlyspending/:accountId",  getCurrentMonthCategorySpending)
router.post("/spendmoney/:accountId", spendMoney)
module.exports = router

