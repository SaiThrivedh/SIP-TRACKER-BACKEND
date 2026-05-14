const { verifyJWT } = require("../utility/authManager");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  const payload = verifyJWT(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }

  req.user = payload;

  next();
};

module.exports = authMiddleware;