import { getToken } from "next-auth/jwt";
export const verifyAuth = async (req, res, next) => {
  try {
    const token = await getToken({
      req: { headers: req.headers, cookies: req.cookies },
      secret: process.env.AUTH_SECRET,
      salt: "authjs.session-token", // v5-এ যোগ করুন
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "অনুমতি নেই! আপনি লগইন করা নেই।",
      });
    }

    // টোকেন ডাটা রিকোয়েস্টে অ্যাসাইন করা
    req.user = {
      id: token.id || token.sub, // NextAuth ডিফল্ট আইডি সাধারণত 'sub' এ রাখে
      email: token.email,
      name: token.name,
      role: token.role,
      coinBalance: token.coinBalance,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
