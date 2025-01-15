import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    transactionSummary: {
      totalTransactions: { type: Number, default: 0 },
      recentTransactions: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      ],
    },
    token: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.validatePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.addTransactions = async function (transactionId, session) {
  // Add the new transaction to the beginning of the recentTransactions array
  this.transactionSummary.recentTransactions.unshift(transactionId);
  // If the array exceeds 10 transactions, remove the oldest one
  if (this.transactionSummary.recentTransactions.length > 10) {
    this.transactionSummary.recentTransactions.pop();
  }
  // If the array exceeds 10 transactions, remove the oldest one
  if (this.transactionSummary.recentTransactions.length > 10) {
    this.transactionSummary.recentTransactions.pop();
  }

  this.transactionSummary.totalTransactions += 1;

  await this.save({ session });
}

export default mongoose.model("User", userSchema);
