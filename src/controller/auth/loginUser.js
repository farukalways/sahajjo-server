const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // 👈 ১. bcrypt ইম্পোর্ট করুন
const User = require("../../models/User_model");

// ১. Token Helpers
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ২. Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // পাসওয়ার্ড সহ ইউজার খুঁজে বের করা
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 👈 ২. মডেলের মেথড না ডেকে সরাসরি bcrypt.compare ব্যবহার করা
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // টোকেন জেনারেট করা
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh Token ডাটাবেসে সেভ করা
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Cookie Options
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR DETAILS:", error); // 👈 আসল এরর দেখতে টার্মিনালে চেক করুন
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal Server Error",
    });
  }
};

module.exports = { loginUser };
