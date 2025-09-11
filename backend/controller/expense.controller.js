const Account = require("../model/account.model");
const Budget = require("../model/budget.model");
const Transaction = require("../model/transaction.model");


const spendMoney = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount, category, description } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: "Amount and category are required" });
    }

    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    // 1️⃣ Find the main account
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    // 2️⃣ Get user's budgets
    const budgets = await Budget.find({ userId: account.userId });

    // 3️⃣ Find the selected category
    const budget = budgets.find(b => b.category === category);
    if (!budget) return res.status(400).json({ message: `Budget category "${category}" not found` });

    // 4️⃣ Check if category has enough allocated funds
    if (budget.allocated < numericAmount) {
      return res.status(400).json({ message: "Insufficient funds in this budget category" });
    }

    // 5️⃣ Deduct from budget and main account balance
    budget.allocated -= numericAmount;
    await budget.save();

    account.balance -= numericAmount;
    await account.save();

    // 6️⃣ Create transaction
    const tx = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: "debit",
      amount: numericAmount,
      category,
      description: description || `Spent from ${category}`,
    });
    await tx.save();

    // 7️⃣ Return response
    res.json({
      success: true,
      message: `Spent ${numericAmount} from ${category}`,
      allocations: [{ category: budget.category, deducted: numericAmount }],
      balance: account.balance,
      transaction: tx,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = spendMoney