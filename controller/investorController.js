const investorModel = require("../models/investorModel");






const createInvestor = async (req, res) => {
    try {
        const investor = await investorModel.createInvestor(req.body);
        res.status(201).json(investor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getInvestor = async (req, res) => {
    try {
        
        const investor = await investorModel.getInvestorById(req.params.investorId);
        res.status(200).json(investor);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error("Error fetching investor:", err);
    }
};

const getInvestorHoldings = async (req, res) => {
    try {
        const { investorId } = req.params;
        console.log("Fetching holdings for investor with ID:", investorId);
        const data = await investorModel.getHoldings(investorId);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getInvestorNetworth = async (req, res) => {
    try {
        const { investorId } = req.params;
        const data = await investorModel.getNetworth(investorId);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createInvestor,
    getInvestor,    
    getInvestorHoldings,
    getInvestorNetworth
};