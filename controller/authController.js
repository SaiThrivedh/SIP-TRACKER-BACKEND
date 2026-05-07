const { signJWT } = require("../utility/authManager");
const {
    findUserByEmail,
    blacklistToken
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

        // ✅ USE authManager HERE
        const token = signJWT({
            investor_id: user.investor_id,
            email: user.email
        });

        return res.json({ token });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const logout = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Token required" });
    }

    blacklistToken(token);

    res.json({ message: "Logged out" });
};

module.exports = { login, logout };