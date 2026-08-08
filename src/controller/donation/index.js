const mongoose = require("mongoose");
const Case = require("../../models/Case_model");
const User = require("../../models/User_model");
const Donation = require("../../models/Donation_model");

const makeDonation = async (req, res) => {
  try {
    const { caseId, amount } = req.body;
    // Auth Middleware থেকে পাওয়া সিকিউরড User ID
    const userId = req.user?.id || req.user?._id;

    // ১. Basic Validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access! Please login.",
      });
    }

    if (!caseId || !amount) {
      return res.status(400).json({
        success: false,
        message: "caseId and amount are required",
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    // ২. User Check & Balance Check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.coinBalance < numericAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient coin balance",
      });
    }

    // ৩. Case Check & Limit Verification
    const targetCase = await Case.findById(caseId);
    if (!targetCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const remainingNeeded = targetCase.target - targetCase.raised;
    if (remainingNeeded <= 0) {
      return res.status(400).json({
        success: false,
        message: "This case target is already fulfilled!",
      });
    }

    if (numericAmount > remainingNeeded) {
      return res.status(400).json({
        success: false,
        message: `You cannot donate more than the remaining needed amount (৳${remainingNeeded})`,
      });
    }

    // ৪. Update User Balance & Total Donated
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          coinBalance: -numericAmount,
          totalDonated: numericAmount,
        },
      },
      { returnDocument: "after" }, // Updated from { new: true }
    );

    // ৫. Update Case Raised Amount & Donors Count
    await Case.findByIdAndUpdate(caseId, {
      $inc: {
        raised: numericAmount,
        donors: 1,
      },
    });

    // ৬. Create Donation Record
    const transactionId = `TXN-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    const donationRecord = await Donation.create({
      userId,
      caseId,
      amount: numericAmount,
      transactionId,
    });

    return res.status(201).json({
      success: true,
      message: "Donation processed successfully",
      data: donationRecord,
      remainingBalance: updatedUser.coinBalance,
    });
  } catch (error) {
    console.log("Donation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { makeDonation };
