const db = require('../utility/dbManager');

const createFund = (data) => {
    const { amc_id, fund_name, fund_type, risk_level } = data;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO mutual_fund (amc_id, fund_name, fund_type, risk_level, created_at)
            VALUES (?, ?, ?, ?, DATE('now'))
        `;

        db.run(sql, [amc_id, fund_name, fund_type, risk_level], function(err) {
            if (err) reject(err);
            else resolve({ fund_id: this.lastID });
        });
    });
};

const getAllFunds = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT f.*, a.amc_name
            FROM mutual_fund f
            JOIN amc a ON f.amc_id = a.amc_id
        `;

        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const updateNAV = (fundId, nav) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO nav_history (fund_id, nav, nav_date)
            VALUES (?, ?, DATE('now'))
        `;

        db.run(sql, [fundId, nav], function(err) {
            if (err) reject(err);
            else resolve({ nav_id: this.lastID });
        });
    });
};

module.exports = { createFund, getAllFunds, updateNAV };