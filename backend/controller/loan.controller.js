import Loan from "../models/Loan.js";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const createMultipleLoans = async (req, res) => {
  try {
    const { loans } = req.body; // array of loan objects: [{accountId, amount, dueDate}, ...]

    if (!Array.isArray(loans) || loans.length === 0) {
      return res.status(400).json({ message: "Send an array of loans" });
    }

    let createdLoans = [];

    for (const l of loans) {
      const account = await Account.findById(l.accountId);
      if (!account) continue; // skip if account doesn't exist

      const loan = new Loan({
        userId: account.userId,
        accountId: account._id,
        provider: account.provider,
        amount: l.amount,
        outstanding: l.amount,
        dueDate: l.dueDate || null,
      });

      await loan.save();

      // credit the account balance to simulate disbursement
      account.balance += Number(l.amount);
      await account.save();

      // log transaction
      const tx = new Transaction({
        userId: account.userId,
        accountId: account._id,
        type: "credit",
        amount: Number(l.amount),
        description: "Loan disbursement",
        category: "Loan",
      });
      await tx.save();

      createdLoans.push(loan);
    }

    res.status(201).json({
      success: true,
      message: `${createdLoans.length} loans created and disbursed`,
      loans: createdLoans,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
