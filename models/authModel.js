const client = require("../utility/pgManager");

const blacklistedTokens = new Set();

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT * FROM investor WHERE email = $1",
      [email],
      (err, result) => {
        if (err) reject(err);
        else resolve(result.rows[0] || null);
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