import jwt from "jsonwebtoken";

export const verifyAuth = async (req, res, next) => {
  try {
    // ১. cookie-parser এর মাধ্যমে কুকি থেকে টোকেন নেওয়া
    const token = req.cookies?.accessToken;

    // টোকেন না থাকলে ৪০১ রেসপন্স
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "অনুমতি নেই! আপনি লগইন করা নেই।",
      });
    }

    // ২. JWT টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ৩. ডিকোড করা ডাটা রিকোয়েস্টে সেট করা
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // পরবর্তী কন্ট্রোলার বা মিডলওয়্যারে পাঠানো
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "টোকেনটি অবৈধ অথবা এক্সপায়ার্ড হয়ে গেছে!",
    });
  }
};
