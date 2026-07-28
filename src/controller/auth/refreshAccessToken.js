const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check refresh token matches the one stored in DB
    if (user.refreshToken !== incomingRefreshToken) {
      return res.status(403).json({
        success: false,
        message: "Refresh token mismatch, please login again",
      });
    }

    // Generate new tokens (rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { refreshAccessToken };
