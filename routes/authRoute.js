const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { login, logout } = require("../controller/authController");



router.post("/login", login);
router.post("/logout", logout);


router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;