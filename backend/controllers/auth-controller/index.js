const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

// Public sign-up may only ever create a student or instructor account.
// The "admin" role can only be granted later via the admin panel.
const SELF_SERVICE_ROLES = ["user", "instructor"];

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  if (!userName || !userEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "User name, email and password are required",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role: SELF_SERVICE_ROLES.includes(role) ? role : "user",
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = signAccessToken(checkUser);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const updateProfile = async (req, res) => {
  const { userName } = req.body;

  if (!userName || !userName.trim()) {
    return res.status(400).json({
      success: false,
      message: "User name is required",
    });
  }

  const existingUser = await User.findOne({
    userName,
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name already taken",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { userName: userName.trim() },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  const user = await User.findById(req.user._id);

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
};
