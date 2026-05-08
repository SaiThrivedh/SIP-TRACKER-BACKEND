const client = require('../utility/dbManager');

const createFund = (data) => {
    const { amc_id, fund_name, fund_type, risk_level } = data;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO mutual_fund (amc_id, fund_name, fund_type, risk_level, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_DATE)
            RETURNING fund_id
        `;

        client.query(sql, [amc_id, fund_name, fund_type, risk_level], (err, result) => {
            if (err) reject(err);
            else resolve({ fund_id: result.rows[0].fund_id });
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

        client.query(sql, [], (err, result) => {
            if (err) reject(err);
            else resolve(result.rows);
        });
    });
};

const updateNAV = (fundId, nav) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO nav_history (fund_id, nav, nav_date)
            VALUES ($1, $2, CURRENT_DATE)
            RETURNING nav_id
        `;

        client.query(sql, [fundId, nav], (err, result) => {
            if (err) reject(err);
            else resolve({ nav_id: result.rows[0].nav_id });
        });
    });
};

module.exports = { createFund, getAllFunds, updateNAV };