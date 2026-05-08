const client = require('../utility/pgManager');

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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)
            RETURNING investor_id
        `;

        client.query(
            sql,
            [first_name, middle_name, last_name, email, phone, dob, gender, pan, aadhaar, occupation],
            (err, result) => {
                if (err) reject(err);
                else resolve({ investor_id: result.rows[0].investor_id });
            }
        );
    });
};

const getInvestorById = (id) => {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM investor WHERE investor_id = $1`,
            [id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.rows[0]);
            }
        );
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
            WHERE p.investor_id = $1
            GROUP BY mf.fund_name
        `;

        client.query(sql, [investorId], (err, result) => {
            if (err) reject(err);
            else resolve(result.rows);
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
            WHERE p.investor_id = $1
            AND nh.nav_date = (
                SELECT MAX(nav_date) FROM nav_history WHERE fund_id = mf.fund_id
            )
            GROUP BY mf.fund_name, nh.nav
        `;

        client.query(sql, [investorId], (err, result) => {
            if (err) reject(err);
            else resolve(result.rows);
        });
    });
};

module.exports = { createInvestor, getInvestorById, getHoldings, getNetworth };