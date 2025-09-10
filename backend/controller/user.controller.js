const Account = require("../model/account.model");
const User = require("../model/sme.model");
const bcrypt = require("bcryptjs")



const createUser = async (req, res) => {
  try {
    const { name, email, password, bvn } = req.body;

    if (!name || !email || !password || !bvn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (String(bvn).length !== 11) {
      return res.status(400).json({ message: "BVN must be 11 digits" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const existingBvn = await User.findOne({ bvn });
    if (existingBvn) return res.status(400).json({ message: "BVN already linked to another account" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, bvn });
    await user.save();


     const demoAccounts = [
      {
        userId: user._id,
        provider: "DemoBank",
        number: "1234567890",
        mask: "****7890",
        balance: 5000,
        currency: "NGN",
      },
      {
        userId: user._id,
        provider: "MockPay",
        number: "9876543210",
        mask: "****3210",
        balance: 12000,
        currency: "NGN",
      },
    ];
    await Account.insertMany(demoAccounts);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, bvn: user.bvn },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // basic validation
    if (!name || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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
    if (!user) return res.status(404).json({ message: "No user linked to BVN" });

    const accounts = await Account.find({ userId: user._id });

    res.status(200).json({
      success: true,
      bvnMasked: `***${bvn.slice(-4)}`,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to link account" });
  }
};


module.exports = {
  createUser,
  linkBvn,
  loginUser
};
