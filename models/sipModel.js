const db = require('../utility/dbManager');

const createSIP = (data) => {
    const { portfolio_id, fund_id, sip_amount, sip_date, start_date } = data;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO sip_registration 
            (portfolio_id, fund_id, sip_amount, sip_date, start_date, status)
            VALUES (?, ?, ?, ?, ?, 'ACTIVE')
        `;

        db.run(sql, [portfolio_id, fund_id, sip_amount, sip_date, start_date],
            function(err) {
                if (err) reject(err);
                else resolve({ sip_id: this.lastID });
            });
    });
};

const getSIPById = (sipId) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM sip_registration WHERE sip_id = ?`, [sipId],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
    });
};

const getTransactions = (sipId) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM investment_transaction WHERE sip_id = ?`, [sipId],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
    });
};

const processSIP = (sipId) => {
    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.get(`SELECT * FROM sip_registration WHERE sip_id = ?`, [sipId], (err, sip) => {
                if (err ) {
                    db.run("ROLLBACK");
                    return reject(err );
                }

                db.get(`
                    SELECT nav FROM nav_history 
                    WHERE fund_id = ? 
                    ORDER BY nav_date DESC LIMIT 1
                `, [sip.fund_id], (err, navRow) => {

                    if (err ) {
                        db.run("ROLLBACK");
                        return reject(err );
                    }

                    const units = sip.sip_amount / navRow.nav;

                    db.run(`
                        INSERT INTO investment_transaction
                        (sip_id, portfolio_id, fund_id, transaction_amount, nav_at_purchase, units_allocated, transaction_date)
                        VALUES (?, ?, ?, ?, ?, ?, DATE('now'))
                    `, [sip.sip_id, sip.portfolio_id, sip.fund_id, sip.sip_amount, navRow.nav, units],
                    function(err) {

                        if (err) {
                            db.run("ROLLBACK");
                            reject(err);
                        } else {
                            db.run("COMMIT");
                            resolve({ transaction_id: this.lastID });
                        }
                    });

                });

            });

        });

    });
};

module.exports = { createSIP, getSIPById, getTransactions, processSIP };