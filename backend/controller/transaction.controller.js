const { default: mongoose } = require("mongoose");
const Account = require("../model/account.model");
const Transaction = require("../model/transaction.model");


const createTransaction = async (req, res) => {
  try {
    const { userId, accountId, type, amount, description, category } = req.body;
    console.log(accountId)
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += type === "credit" ? amount : -amount;
    await account.save();

    const tx = await Transaction.insertMany([{
        userId, accountId, type, amount, description, category
   
    }])
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    // find main account
    const mainAccount = await Account.findOne({ userId, main: true });
    if (!mainAccount) return res.status(404).json({ message: "Main account not found" });

    // fetch transactions for main account only
    const transactions = await Transaction.find({ accountId: mainAccount._id }).sort({ date: -1 });

    res.json({ success: true, account: mainAccount, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


 const getMonthlyCategorySpending = async (req, res) => {
  try {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: "Invalid accountId" });
    }

    // group all debit transactions by month & category for the given account
    const spending = await Transaction.aggregate([
      {
        $match: {
          accountId: new mongoose.Types.ObjectId(accountId),
          type: "debit",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          category: "$_id.category",
          totalSpent: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1, category: 1 } },
    ]);

    res.json({ success: true, spending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createTransaction,
    getTransactions,
    getMonthlyCategorySpending
}