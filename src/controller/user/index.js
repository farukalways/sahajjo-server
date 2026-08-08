const User = require("../../models/User_model");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // success: true এবং user ডাটা পাঠানো হলো
    res.status(200).json({
      success: true,
      user: user, // অথবা সংক্ষেপে শুধু user
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getUser };
