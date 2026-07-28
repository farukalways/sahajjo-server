const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

donationSchema.index({ userId: 1, createdAt: -1 });
donationSchema.index({ caseId: 1, createdAt: -1 });

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
