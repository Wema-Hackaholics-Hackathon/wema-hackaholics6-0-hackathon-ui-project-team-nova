const { default: mongoose } = require("mongoose");
const Account = require("../model/account.model");
const Transaction = require("../model/transaction.model");


const createTransaction = async (req, res) => {
  try {
    const { userId, accountId, type, amount, description, category } = req.body;
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += type === "credit" ? amount : -amount;
    await account.save();

    const tx = await Transaction.insertMany({
        userId, accountId, type, amount, description
   
    })
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    const tx = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMonthlyCategorySpending = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // group all debit (spending) transactions by month & category
    const spending = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "debit",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
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