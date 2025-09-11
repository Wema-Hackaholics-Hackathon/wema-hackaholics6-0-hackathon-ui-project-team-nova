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

    const tx = await Transaction.create({
        userId, accountId, type, amount, description, category
   
    })
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


const getCurrentMonthCategorySpending = async (req, res) => {
  try {
    const { accountId } = req.params;

    // 1️⃣ Validate accountId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: "Invalid accountId" });
    }
    const accountObjectId = new mongoose.Types.ObjectId(accountId);

    // 2️⃣ Get current month & year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JS months: 0-11
    const currentYear = now.getFullYear();

    // 3️⃣ Aggregate transactions for this account and current month
    const spending = await Transaction.aggregate([
      {
        $match: {
          accountId: accountObjectId,      // Only this account
          type: "debit",                  // Only spending
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $year: "$date" }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",               // Group by category
          totalSpent: { $sum: "$amount" } // Sum the amount per category
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpent: 1
        }
      },
      { $sort: { totalSpent: -1 } } // Optional: sort by highest spending first
    ]);

    res.json({ success: true, month: currentMonth, year: currentYear, spending });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
    createTransaction,
    getTransactions,
   getCurrentMonthCategorySpending
}