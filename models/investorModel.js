const db = require('../utility/dbManager');

const createInvestor = (data) => {
    const {
        first_name, middle_name, last_name,
        email, phone, dob, gender,
        pan, aadhaar, occupation
    } = data;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO investor 
            (first_name, middle_name, last_name, email, phone, dob, gender, pan, aadhaar, occupation, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
        `;

        db.run(sql, [first_name, middle_name, last_name, email, phone, dob, gender, pan, aadhaar, occupation],
            function(err) {
                if (err) reject(err);
                else resolve({ investor_id: this.lastID });
            });
    });
};

const getInvestorById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM investor WHERE investor_id = ?`, [id],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
    });
};

const getHoldings = (investorId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                mf.fund_name,
                SUM(it.units_allocated) AS total_units
            FROM investment_transaction it
            JOIN portfolio p ON it.portfolio_id = p.portfolio_id
            JOIN mutual_fund mf ON it.fund_id = mf.fund_id
            WHERE p.investor_id = ?
            GROUP BY mf.fund_name
        `;

        db.all(sql, [investorId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getNetworth = (investorId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                mf.fund_name,
                SUM(it.units_allocated) * nh.nav AS current_value
            FROM investment_transaction it
            JOIN portfolio p ON it.portfolio_id = p.portfolio_id
            JOIN mutual_fund mf ON it.fund_id = mf.fund_id
            JOIN nav_history nh ON mf.fund_id = nh.fund_id
            WHERE p.investor_id = ?
            AND nh.nav_date = (
                SELECT MAX(nav_date) FROM nav_history WHERE fund_id = mf.fund_id
            )
            GROUP BY mf.fund_name
        `;

        db.all(sql, [investorId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

module.exports = { createInvestor, getInvestorById, getHoldings, getNetworth };