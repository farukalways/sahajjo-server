const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    coinBalance: { type: Number, default: 50000 },
    totalDonated: { type: Number, default: 0 },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
