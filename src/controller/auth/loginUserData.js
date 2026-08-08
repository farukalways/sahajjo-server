const User = require("../../models/User_model");
const jwt = require("jsonwebtoken");

const getUserData = async (req, res) => {
  // ১. Authorization header থেকে token বের করা
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthenticated: No token provided" });
  }

  try {
    // ২. Token verify করা (JWT_ACCESS_SECRET ব্যবহার করা হয়েছে)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ৩. Payload থেকে 'id' পড়া (userId নয়)
    const { id, email } = decoded;

    if (!id || !email) {
      return res.status(401).json({ message: "Invalid Token Payload" });
    }

    // ৪. id দিয়ে ডাটাবেজে ইউজার খোঁজা
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ৫. Token এর email আর DB এর email চেক করা
    if (user.email !== email) {
      return res
        .status(401)
        .json({ message: "Token mismatch: Invalid credentials" });
    }

    // ৬. সব ঠিক থাকলে ডাটা রিটার্ন করা
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("VERIFY ERROR:", error.message); // 👈 ব্যাকএন্ড টার্মিনালে আসল এরর প্রিন্ট করুন
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res
      .status(401)
      .json({ message: "Invalid Token", error: error.message });
  }
};

module.exports = { getUserData };
