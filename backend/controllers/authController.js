const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/email");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log(`OTP for ${email}: ${otp}`);

    await OTP.create({
      email,
      otp,
      action: "account_verification",
    });

    await sendOTPEmail(
      email,
      otp,
      "account_verification"
    );

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for OTP verification.",
      email: user.email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check Account Verification
    if (!user.isVerified) {
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      await OTP.deleteMany({
        email,
        action: "account_verification",
      });

      await OTP.create({
        email,
        otp,
        action: "account_verification",
      });

      await sendOTPEmail(
        email,
        otp,
        "account_verification"
      );

      console.log(`OTP for ${email}: ${otp}`);

      return res.status(400).json({
        message:
          "Account not verified. OTP has been sent again.",
      });
    }

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify OTP
exports.verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    await OTP.deleteMany({
      email,
      action: "account_verification",
    });

    res.status(200).json({
      message:
        "Account verified successfully. You can now log in.",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};