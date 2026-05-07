const sipModel = require("../models/sipModel");


const createSIP = async (req, res) => {
    try {
        const sip = await sipModel.createSIP(req.body);
        res.status(201).json(sip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSIP = async (req, res) => {
    try {
        const { sipId } = req.params;
        const sip = await sipModel.getSIPById(sipId);
        res.status(200).json(sip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSIPTransactions = async (req, res) => {
    try {
        const { sipId } = req.params;
        const data = await sipModel.getTransactions(sipId);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const monthlySIPTransaction = async (req, res) => {
    try {
        const { sipId } = req.params;

        const result = await sipModel.processSIP(sipId);

        res.status(200).json({
            message: "SIP processed",
            result
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createSIP,
    getSIP,             
    getSIPTransactions,
    monthlySIPTransaction
};