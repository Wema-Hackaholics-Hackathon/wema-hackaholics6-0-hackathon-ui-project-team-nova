const Account = require("../model/account.model");
const Loan = require("../model/loan.model");
const User = require("../model/sme.model");
const bcrypt = require("bcryptjs");
const Transaction = require("../model/transaction.model");

const createUser = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // validation
    if (!name || !email || !password )
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword});
    await user.save();

    // Demo linked accounts
    const demoAccounts = [
      {
        userId: user._id,
        provider: "GTB Bank",
        number: "1234567890",
        mask: "****7890",
        balance: 5000,
        currency: "NGN",
      },
      {
        userId: user._id,
        provider: "PalmPay",
        number: "9876543210",
        mask: "****3210",
        balance: 12000,
        currency: "NGN",
      },
    ];
    await Account.insertMany(demoAccounts);

    // Main account
    const mainAccount = new Account({
      userId: user._id,
      provider: "Wema Bank",
      number: "GAN" + Math.floor(100000 + Math.random() * 900000),
      mask:
        "****" + String(Math.floor(100000 + Math.random() * 900000)).slice(-4),
      balance: 0,
      main: true,
      currency: "NGN",
    });
    await mainAccount.save();

    res.status(201).json({
      success: true,
      message: "User created with main and demo accounts",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      mainAccount: {
        accountId: mainAccount._id,
        number: mainAccount.number,
        balance: mainAccount.balance,
        provider: mainAccount.provider,
        currency: mainAccount.currency,
      },
      demoAccounts, // show demo accounts in response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // basic validation
    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // check if user exists
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // success
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const linkBvn = async (req, res) => {
  try {
    const { bvn } = req.body;

    if (!bvn || String(bvn).length !== 11) {
      return res.status(400).json({ message: "Invalid BVN" });
    }

    const user = await User.findOne({ bvn });
    if (!user)
      return res.status(404).json({ message: "No user linked to BVN" });

    const accounts = await Account.find({ userId: user._id });

    const linkedAccounts = await Promise.all(
      accounts.map(async (a) => {
        const loans = await Loan.find({ accountId: a._id }); // loans or []
        const transactions = await Transaction.find({ accountId: a._id });

        return {
          id: a._id,
          provider: a.provider,
          mask: a.mask || `****${a.number.slice(-4)}`,
          balance: a.balance,
          currency: a.currency,
          loans: loans.length > 0 ? loans : [],
          transactions: transactions.length ? transactions : [],
        };
      })
    );
    res.status(200).json({
      success: true,
      bvnMasked: `***${bvn.slice(-4)}`,
      linkedAccounts: linkedAccounts,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to link account" });
  }
};

module.exports = {
  createUser,
  linkBvn,
  loginUser,
};
