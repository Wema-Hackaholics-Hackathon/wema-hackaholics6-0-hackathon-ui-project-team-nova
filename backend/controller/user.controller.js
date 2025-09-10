const Account = require("../model/account.model");
const User = require("../model/sme.model");
const bcrypt = require("bcryptjs")



export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
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
  const { bvn } = req.body;
  try {
    if (!bvn || String(bvn).length !== 11)
      return res.status(400).json({ message: "Invalid BVN" });
    const user = await User.findOne({ bvn });
    if (!user)
      return res.status(404).json({ message: "No user linked to BVN" });

    const accounts = await Account.findOne({ userId: user._id });
    res.status(200).json({
      success: true,
      linkedAccounts: accounts.map((a) => ({
        id: a._id,
        provider: a.provider,
        mask: a.mask || `****${a.number.slice(-4)}`,
        balance: a.balance,
        currency: a.currency,
      })),
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {}
};

module.exports = {
  createUser,
  linkBvn
};
