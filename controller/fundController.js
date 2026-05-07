const fundModel = require("../models/fundModel");




const createNewMutualFund = async (req, res) => {
    try {
        const fund = await fundModel.createFund(req.body);
        res.status(201).json(fund);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllMutualFunds = async (req, res) => {
    try {
        const funds = await fundModel.getAllFunds();
        res.status(200).json(funds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMutualFundNav = async (req, res) => {
    try {
        const { fundId } = req.params;
        const { nav } = req.body;

        const result = await fundModel.updateNAV(fundId, nav);

        res.status(200).json({ message: "NAV updated", result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createNewMutualFund,
    getAllMutualFunds,
    updateMutualFundNav
};