const { verifyJWT } = require("../utility/authManager");
const { isBlacklisted } = require("../models/authModel");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

   
    if (isBlacklisted(token)) {
        return res.status(401).json({ message: "Token blacklisted" });
    }

    
    const payload = verifyJWT(token);

    if (!payload) {
        return res.status(401).json({ message: "Invalid/expired token" });
    }

    req.user = payload;

    next();
};

module.exports = authMiddleware;