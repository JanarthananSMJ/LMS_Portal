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

module.exports = { registerUser, loginUser };
