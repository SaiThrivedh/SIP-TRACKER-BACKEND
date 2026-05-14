const client = require('../utility/pgManager');

const createSIP = (data) => {
    const { portfolio_id, fund_id, sip_amount, sip_date, start_date } = data;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO sip_registration 
            (portfolio_id, fund_id, sip_amount, sip_date, start_date, status)
            VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
            RETURNING sip_id
        `;

        client.query(sql, [portfolio_id, fund_id, sip_amount, sip_date, start_date],
            (err, result) => {
                if (err) reject(err);
                else resolve({ sip_id: result.rows[0].sip_id });
            });
    });
};

const getSIPById = (sipId) => {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM sip_registration WHERE sip_id = $1`,
            [sipId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.rows[0]);
            }
        );
    });
};

const getTransactions = (sipId) => {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM investment_transaction WHERE sip_id = $1`,
            [sipId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.rows);
            }
        );
    });
};

const processSIP = (sipId) => {
    return new Promise((resolve, reject) => {

        client.query("BEGIN", (err) => {
            if (err) return reject(err);

            client.query(
                `SELECT * FROM sip_registration WHERE sip_id = $1`,
                [sipId],
                (err, sipResult) => {

                    if (err) {
                        return client.query("ROLLBACK", () => reject(err));
                    }

                    const sip = sipResult.rows[0];

                    client.query(
                        `SELECT nav FROM nav_history 
                         WHERE fund_id = $1 
                         ORDER BY nav_date DESC LIMIT 1`,
                        [sip.fund_id],
                        (err, navResult) => {

                            if (err) {
                                return client.query("ROLLBACK", () => reject(err));
                            }

                            const nav = navResult.rows[0].nav;
                            const units = sip.sip_amount / nav;

                            client.query(
                                `INSERT INTO investment_transaction
                                (sip_id, portfolio_id, fund_id, transaction_amount, nav_at_purchase, units_allocated, transaction_date)
                                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
                                RETURNING transaction_id`,
                                [sip.sip_id, sip.portfolio_id, sip.fund_id, sip.sip_amount, nav, units],
                                (err, txResult) => {

                                    if (err) {
                                        return client.query("ROLLBACK", () => reject(err));
                                    } else {
                                        client.query("COMMIT", (err) => {
                                            if (err) reject(err);
                                            else resolve({ transaction_id: txResult.rows[0].transaction_id });
                                        });
                                    }

                                }
                            );

                        }
                    );

                }
            );

        });

    });
};


const getAllTransactions = () => {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM investment_transaction`,
            (err, result) => {
                if (err) {
                    console.error("Error fetching all transactions:", err);
                    reject(err);
                }
                else resolve(result.rows);
            }
        );
    });
};

module.exports = { createSIP, getSIPById, getTransactions, processSIP, getAllTransactions };