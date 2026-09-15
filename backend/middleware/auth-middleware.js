const jwt = require("jsonwebtoken");

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  try {
    const payload = verifyToken(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please sign in again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authenticate;
