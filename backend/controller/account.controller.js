const Account = require("../model/account.model");
const Transaction = require("../model/transaction.model");

const getAccounts = async (req, res) => {
  try {
    const { userId } = req.query;
    const accounts = await Account.find({ userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


 const addMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description} = req.body;
    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += Number(amount);
    await account.save();

    const tx = new Transaction({
      userId: account.userId,
      accountId: account._id,
      type: "credit",
      amount: Number(amount),
      description
    });
    await tx.save();

    res.json({ success: true, balance: account.balance, tx });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
    getAccounts,
    addMoney
}