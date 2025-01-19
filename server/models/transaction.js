import mongoose from "mongoose";
const opts = { toJSON: { virtuals: true } };
const transactionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1."],
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["credit", "debit"],
        message: "{VALUE} is not a valid category. Must be credit or debit.",
      },
    },
    description: {
      type: String,
      required: true,
      minlength: [5, "Description must be at least 5 letter long."],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

transactionSchema.index({ user: 1 });

transactionSchema.virtual("isCredit").get(function () {
  return this.category === "credit";
});

transactionSchema.virtual("formattedDate").get(function () {
  return this.date.toDateString();
});

// .lean({ virtuals: true })

export default mongoose.model("Transaction", transactionSchema);
