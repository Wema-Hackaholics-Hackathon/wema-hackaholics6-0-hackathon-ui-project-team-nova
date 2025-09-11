const Account = require("../model/account.model");
const Loan = require("../model/loan.model");
const Transaction = require("../model/transaction.model");

const creditMeter = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // 1️⃣ Get all accounts for this user
    const accounts = await Account.find({ userId });

    // 2️⃣ Get all transactions across all accounts
    const allTransactions = await Transaction.find({
      accountId: { $in: accounts.map(a => a._id) },
    });

    // 3️⃣ Get all loans across all accounts
    const allLoans = await Loan.find({
      accountId: { $in: accounts.map(a => a._id) },
    });

    // 4️⃣ Detect subscriptions (isSubscription = true)
    const subscriptions = allTransactions
      .filter(t => t.isSubscription)
      .map(t => ({
        category: t.category,
        description: t.description,
        amount: t.amount,
      }));

    // 5️⃣ Calculate totals
    const incomeTotal = allTransactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0) || 1;

    const expensesTotal = allTransactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const debtTotal = allLoans.reduce((sum, l) => sum + l.outstanding, 0);

    // 6️⃣ Compute credit score
    const score = Math.max(
      0,
      Math.min(
        100,
        80 - (expensesTotal / incomeTotal) * 30 - (debtTotal / incomeTotal) * 30
      )
    );

    res.json({ success: true, score, subscriptions, accounts: accounts.length });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = creditMeter