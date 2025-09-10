const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: String, default: "DemoBank" },
    number: { type: String, required: true }, // masked or full (demo)
    mask: { type: String },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "NGN" },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("account", accountSchema)

module.exports = Account