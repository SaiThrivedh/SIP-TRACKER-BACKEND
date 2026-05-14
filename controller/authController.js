const { signJWT } = require("../utility/authManager");
const {
  findUserByEmail
} = require("../models/authModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.password_hash !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = signJWT({
      investor_id: user.investor_id,
      email: user.email
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({ user });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

module.exports = { login, logout };