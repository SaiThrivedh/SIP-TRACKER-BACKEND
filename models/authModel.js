const client = require("../utility/pgManager");

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

module.exports = {
  findUserByEmail
};