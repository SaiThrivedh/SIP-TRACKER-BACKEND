const db = require("../utility/dbManager");


const blacklistedTokens = new Set();

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM investor WHERE email = ?`,
            [email],
            (err, user) => {
                if (err) return reject(err);
                resolve(user);
            }
        );
    });
};

const blacklistToken = (token) => {
    blacklistedTokens.add(token);
};

const isBlacklisted = (token) => {
    return blacklistedTokens.has(token);
};

module.exports = {
    findUserByEmail,
    blacklistToken,
    isBlacklisted
};