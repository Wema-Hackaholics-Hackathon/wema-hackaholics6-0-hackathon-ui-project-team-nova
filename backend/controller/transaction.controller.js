const Account = require("../model/account.model");
const Transaction = require("../model/transaction.model");


const createTransaction = async (req, res) => {
  try {
    const { userId, accountId, type, amount, description } = req.body;
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += type === "credit" ? amount : -amount;
    await account.save();

    const tx = new Transaction({ userId, accountId, type, amount, description });
    await tx.save();
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

module.exports = {
    createTransaction,
    getTransactions
}