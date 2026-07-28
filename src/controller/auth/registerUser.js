const bcrypt = require("bcrypt");
const User = require("../../models/User_model");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ui-avatars দিয়ে নামের ভিত্তিতে ইমেজ জেনারেট
    const avatarImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=random&color=fff&size=256`;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image: avatarImage,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { registerUser };
